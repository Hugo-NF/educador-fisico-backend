const jwt = require('jsonwebtoken');

const errors = require('../config/errorCodes');
const constants = require('../config/constants');

const User = require('../models/User');
const Role = require('../models/Role');
const Claim = require('../models/Claim');

class UsersHelper {
  static async generateJWT(user) {
    return jwt.sign({ _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: constants.JWT_LIFESPAN });
  }

  static async hasRole(userId, role) {
    const targetRole = await Role.findOne({ name: role });
    const targetUser = await User.findById(userId);

    if (targetUser) {
      return targetUser.roles.filter((elem) => elem.equals(targetRole._id)).length > 0;
    }
    return false;
  }

  static async hasClaim(userId, claim) {
    const targetClaim = await Claim.findOne({ name: claim });
    const targetUser = await User.findById(userId);

    if (targetUser) {
      const userClaims = await UsersHelper.getClaims(targetUser);

      return userClaims.filter((elem) => elem.equals(targetClaim._id)).length > 0;
    }
    return false;
  }

  static async getClaims(user) {
    const { claims } = user;
    const roles = await Role.find({ _id: user.roles });

    roles.forEach((role) => {
      claims.push(...role.claims);
    });

    return claims;
  }

  static async addRole(userId, role) {
    const roleObj = await Role.findOne({ name: role });
    await User.findOneAndUpdate({ _id: userId }, { $push: { roles: roleObj._id } });
  }

  static async addClaim(userId, claim) {
    const claimObj = await Claim.findOne({ name: claim });
    await User.findOneAndUpdate({ _id: userId }, { $push: { claims: claimObj._id } });
  }

  static async removeRole(userId, role) {
    const roleObj = await Role.findOne({ name: role });
    await User.findOneAndUpdate({ _id: userId }, { $pullAll: { roles: [roleObj._id] } });
  }

  static async removeClaim(userId, claim) {
    const claimObj = await Claim.findOne({ name: claim });
    await User.findOneAndUpdate({ _id: userId }, { $pullAll: { claims: [claimObj._id] } });
  }

  static extractToken(token) {
    return token.replace('Bearer', '').trim();
  }

  static authorize(claim = null) {
    return (request, response, next) => {
      const rawToken = request.header('Authorization');

      if (!rawToken) {
        return response.status(401).json({
          statusCode: 401,
          errorCode: errors.MISSING_AUTH_TOKEN,
        });
      }

      const token = UsersHelper.extractToken(rawToken);

      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (claim === null) return next();

        UsersHelper.hasClaim(verified._id, claim)
          .then((result) => {
            if (result) return next();

            return response.status(403).json({
              statusCode: 403,
              errorCode: errors.UNAUTHORIZED_ROUTE,
            });
          })
          .catch((error) => response.status(500).json(error));
      } catch (error) {
        return response.status(401).json({
          statusCode: 401,
          errorCode: errors.JWT_FORGED,
        });
      }
    };
  }

  static currentUserId(request) {
    const token = request.header('Authorization');

    if (!token) return null;
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      return verified._id;
    } catch (error) {
      return null;
    }
  }

  static async updateLockout(user, currentUTC) {
    if (user.accessFailedCount + 1 >= user.accessFailedLimit) {
      let lockoutUntil = currentUTC;
      lockoutUntil = lockoutUntil.setFullYear(lockoutUntil.getFullYear() + 200);

      await user.updateOne({
        accessFailedCount: user.accessFailedCount + 1,
        lockoutUntil,
        lockoutReason: 'ACCESS_FAILED',
      });

      return {
        statusCode: 401,
        errorCode: errors.ACCESS_FAILED_LIMIT_REACHED,
        message: 'Access Failed limit reached',
        error: {
          lockoutUntil,
          lockoutReason: 'ACCESS_FAILED',
        },
      };
    }

    await user.updateOne({ accessFailedCount: user.accessFailedCount });

    return {
      statusCode: 401,
      errorCode: errors.WRONG_PASSWORD,
      message: 'Passwords do not match',
    };
  }
}

module.exports = UsersHelper;
