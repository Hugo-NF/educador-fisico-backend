const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const errors = require('../config/errorsEnum');

const User = require ('../models/User');
const Role = require ('../models/Role');
const Claim = require ('../models/Claim');

class UsersHelper {
    static async generateJWT(user) {
        return jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFESPAN })
    }

    static async hasClaim(userId, claim) {
        const targetClaim = await Claim.findOne({name: claim });
        const targetUser = await User.findById(userId);
        const userClaims = await UsersHelper.getClaims(targetUser);
        
        return userClaims.filter(elem => elem.equals(targetClaim._id)).length > 0;  
    }

    static async getClaims(user) {
        let claims = user.claims;
        const roles = await Role.find({ _id: user.roles });

        roles.forEach(role => {
            claims.push(...role.claims);
        });

        return claims;
    }

    static async addRole(user, role) {
        const roleObj = await Role.findOne({ name: role });
        if(user.roles.length) {
            user.roles.push(roleObj._id);
        }
        else {
            user.roles = [roleObj._id];
        }
    }

    static async addClaim(user, claim) {
        const claimObj = await claim.findOne({ name: claim });
        if(user.claims.length) {
            user.claims.push(claimObj._id);
        }
        else {
            user.claims = [claimObj._id];
        }
    }

    static async removeRole(user, role) {
        const roleObj = await Role.findOne({ name: role });
        user.roles == user.roles.filter(e => e !== roleObj._id);
    }

    static async removeClaim(user, claim) {
        const claimObj = await Claim.findOne({ name: claim });
        user.claims == user.claims.filter(e => e !== claimObj._id);
    }

    static authorize(claim) {
        return function(request, response, next) {

            const token = request.header('auth-token');
            if(!token) return response.status(401).json({
                'statusCode': 401,
                'errorCode': errors.MISSING_AUTH_TOKEN
            });

            try {
                const verified = jwt.verify(token, process.env.JWT_SECRET);

                if(verified._id != undefined) {
                    UsersHelper.hasClaim(verified._id, claim)
                    .then((result) => {
                        if(result) return next();

                        return response.status(403).json({
                            'statusCode': 403,
                            'errorCode': errors.UNAUTHORIZED_ROUTE
                        });
                    })
                    .catch((error) => {
                        return response.status(500).json(error);
                    });
                }
                else {
                    return response.status(401).json({
                        'statusCode': 401,
                        'errorCode': errors.JWT_FORGED
                    });
                }
            }
            catch (error) {
                return response.status(500).json(error);
            }
        }
    }

    static async updateLockout(user, currentUTC) {
        user.accessFailedCount += 1;
                
        if(user.accessFailedCount >= user.accessFailedLimit) {
            let lockoutUntil = currentUTC;
            lockoutUntil = lockoutUntil.setFullYear(lockoutUntil.getFullYear() + 200);

            await user.update({
                accessFailedCount: user.accessFailedCount,
                lockoutUntil: lockoutUntil,
                lockoutReason: 'ACCESS_FAILED'
            });

            return {
                statusCode: 401,
                errorCode: errors.ACCESS_FAILED_LIMIT_REACHED,
                message: `Access Failed limit reached`,
                error: {
                    lockoutUntil: lockoutUntil,
                    lockoutReason: 'ACCESS_FAILED'
                }
            };
        }

        await user.update({ accessFailedCount: user.accessFailedCount });
        
        return {
            statusCode: 401,
            errorCode: errors.WRONG_PASSWORD,
            message: `Passwords do not match`
        };
    }
}

module.exports = UsersHelper;