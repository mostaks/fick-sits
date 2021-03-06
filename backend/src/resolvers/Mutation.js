const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('../stripe');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const item = await ctx.db.mutation.createItem({
      data: {
        // this is how we create a relationship between a user and an item
        user: {
          connect: {
            id: ctx.request.userId
          }
        },
        ...args
      }
    }, info);
    
    console.log('item', item)

    return item;
  },

  updateItem(parent, args, ctx, info) {
    const updates = { ...args };

    delete updates.id;

    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    }, info);
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // find item
    const item = await ctx.db.query.item({ where }, `{ id title user { id }}`);
    // check if they own that item or have permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => {
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    })

    if (!ownsItem && !hasPermissions) {
      throw new Error('You don\'t have permission to do that')
    }
    // delete it 
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // lowercase the email
    args.email = args.email.toLowerCase();
    // hash password
    const password = await bcrypt.hash(args.password, 10);
    // create user in db
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] }
      }
    }, info);
    // create a jwt token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 24 * 365, // 1 year cookie
    })
    // finally we return the user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. check if that password is correct
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('invalid password');
      
    }
    // 3. generate jwt token
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // 4. set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 24 * 365, // 1 year cookie
    })
    // 5. return the user
    return user;
  },

  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return {
      message: 'Goodbye'
    };
  },

  async requestReset(parent, args, ctx, info) {
    // Check if this is a real user
    const user = await ctx.db.query.user({ where: {email: args.email} });

    if (!user) {
      throw new Error(`no such user found for email ${args.email}`);
    }
    // set a reset token and expiry on that user
    const promisifiedRandomBytes = promisify(randomBytes)
    const resetToken = (await promisifiedRandomBytes(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    console.log('res', res)
    // email them that reset token
    const mailRes = await transport.sendMail({
      from: 'yianni@ga.co',
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(`
          <p>Your password reset token is here!</p>
          \n\n 
          <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
            Click here to reset
          </a>
        `)
    })
    // return the message
    return { message: 'Thanks' };
  },

  async resetPassword(parent, args, ctx, info) {
    // check if the paswords match
    if (args.password !== args.confirmPassword) {
      throw new Error('passwords dont match')
    }
    // check if its a legit reset token
    // check if its expirwed
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 36000000
      }
    });

    if (!user) {
      throw new Error('This token has expired or is invalid')
    }
    // hash their new passowrd
    const password = await bcrypt.hash(args.password, 10);
    // save the new password to the user and remove the old resettoken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    // generate jwt
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // set the jwt cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // return the new user
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    // check if they are loggef in\
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!')
    }
    // query the curent user
    const currentUser = await ctx.db.query.user({
      where: {
        id: ctx.request.userId
      }
    }, info);
    // check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // update the permissions
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions
        }
      },
      where: {
        id: args.userId
      },
    }, info);
  },

  async addToCart(parent, args, ctx, info) {
    // make sure they are signed in
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error('You must be signed in');
    }
    // query the users current cart
    const [ existingCartItem ] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });
    // check if that item is already in their cart and increment by 1 if it is
    if (existingCartItem) {
      console.log('this item is already in their cart')
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      }, info);
    }
    // if its not, create a fresh cartitem for that user
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId }
        },
        item: {
          connect: { id: args.id }
        }
      }
    }, info);
  },

  async removeFromCart(parent, args, ctx, info) {
    // find the cart item
    const cartItem = await ctx.db.query.cartItem({
      where: {id: args.id}
    }, `{ id, user { id } }`)
    // make sure weve found an actual item
    if (!cartItem) {
      throw new Error('No CartItem Found!');
    }
    // make sure they own the cart item
    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error('Cheatin huhh?')
    }
    // delete that cart item
    return ctx.db.mutation.deleteCartItem({
      where: { id: args.id }
    }, info);
  },

  async createOrder(parent, args, ctx, info) {
    // query the current user and make sure they are signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('you must be signed in to complete this order')
    }
      const user = await ctx.db.query.user({ 
        where: {
          id: userId
        }
      }, 
      `{ 
        id
        name
        email
        cart {
          id
          quantity
          item {
            id
            title
            price
            description
            image
            largeImage
          }
        }}`);
    // recalculate the total for the price
    const amount = user.cart.reduce((tally, cartItem) => tally + cartItem.item.price * cartItem.quantity, 0);
    console.log(`going to charge for a total amount of ${amount}`)
    // create the stripe charge (turn token into money)
    const charge = await stripe.charges.create({
      amount,
      currency: 'AUD',
      source: args.token
    });
    // convert the cartitems to orderitems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      }
      delete orderItem.id;
      return orderItem;
    });
    console.log('orderItems', orderItems);
    // create the order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } }
      }
    });
    // clean up - clear the users cart, delete cartitems
    const cartItemIds = user.cart.map(cartItem => cartItem.id)
    await ctx.db.mutation.deleteManyCartItems({ 
      where: {
        id_in: cartItemIds
      }
    });
    // return the order to the client
    return order;
  }
};

module.exports = Mutations;
