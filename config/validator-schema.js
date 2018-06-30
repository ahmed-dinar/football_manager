'use strict';


module.exports = {
  'email': {
    'email': {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    }
  },
  'password': {
    'password': {
      notEmpty: true,
      isLength: {
        options: [{min: 6, max: 30}],
        errorMessage: 'Must be between 6 and 30 chars long'
      },
      errorMessage: 'Password should not be empty'
    }
  },
  'resistration': {
    'email': {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    'password': {
      notEmpty: true,
      isLength: {
        options: [{min: 6, max: 30}],
        errorMessage: 'Must be between 6 and 30 chars long'
      },
      errorMessage: 'Invalid Password'
    },
    'name': {
      notEmpty: true,
      isLength: {
        options: [{ min: 3, max: 250 }],
        errorMessage: 'Must be between 3 and 250 chars long'
      },
      errorMessage: 'Invalid  name'
    }
  },
  'team': {
    'name': {
      notEmpty: true,
      isLength: {
        options: [{min: 3, max: 300}],
        errorMessage: 'Must be between 6 and 30 chars long'
      },
      errorMessage: 'Invalid name'
    },
    'origin': {
      notEmpty: true,
      isLength: {
        options: [{min: 3, max: 40}],
        errorMessage: 'Must be between 6 and 30 chars long'
      },
      errorMessage: 'Invalid origin'
    },
    'net_worth': {
      notEmpty: true,
      isLength: {
        options: [{min: 1, max: 100}],
        errorMessage: 'Must be between 1 and 100 chars long'
      },
      errorMessage: 'Invalid net_worth'
    }
  },
  'player': {
    'name': {
      notEmpty: true,
      isLength: {
        options: [{min: 3, max: 300}],
        errorMessage: 'Must be between 6 and 30 chars long'
      },
      errorMessage: 'Invalid name'
    },
    'position': {
      notEmpty: true,
      isLength: {
        options: [{min: 3, max: 50}],
        errorMessage: 'Must be between 3 and 50 chars long'
      },
      errorMessage: 'Invalid position'
    },
    'rating': {
      notEmpty: true,
      isInt: {
        options: [{ allow_leading_zeroes: false }],
        errorMessage: 'No leading zero is allowed'
      },
      errorMessage: 'Invalid rating'
    },
    'salary': {
      notEmpty: true,
      isLength: {
        options: [{min: 3, max: 100}],
        errorMessage: 'Must be between 1 and 100 chars long'
      },
      errorMessage: 'Invalid salary'
    }
  },
  'updatePlayer': {
    'position': {
      notEmpty: false,
      isLength: {
        options: [{min: 0, max: 50}],
        errorMessage: 'Must be between 3 and 50 chars long'
      },
      errorMessage: 'Invalid position'
    },
    'rating': {
      notEmpty: false,
      isInt: {
        options: [{ allow_leading_zeroes: false }],
        errorMessage: 'No leading zero is allowed'
      },
      errorMessage: 'Invalid rating'
    },
    'salary': {
      notEmpty: false,
      isLength: {
        options: [{min: 0, max: 100}],
        errorMessage: 'Must be between 1 and 100 chars long'
      },
      errorMessage: 'Invalid salary'
    }
  }
};