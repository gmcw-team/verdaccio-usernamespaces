const createError = require('http-errors');
const get = require('lodash.get');

class UserNamespacesPlugin {
  constructor(config, stuff) {
    this.logger = stuff.logger;
    this.matchPackagename = get(config, 'match-packagename', false);
  }

  allow_action(action) {
    return function (user, pkg, callback) {
      const {
        name: userName,
        groups: userGroups
      } = user;

      // Split pkgName
      const pkgFullName = pkg.name;
      const isOrgPackage = pkgFullName.startsWith('@');
      const orgEnd = pkgFullName.indexOf('/');

      let pkgName;
      let orgName;

      if (orgEnd > 0) {
        orgName = pkgFullName.slice(1, orgEnd);
        pkgName = pkgFullName.slice(orgEnd+1);
      }
      else {
        pkgName = pkgFullName;
        orgName = null;
      }

      if (userName) {
        if (pkg[action].includes('$usernamespace') && ((pkgName.startsWith(userName + ".") && this.matchPackagename) || (orgName == userName && !this.matchPackagename))) {
          return callback(null, true);
        }
        else {
          return callback(createError(401, `usernamespace required to ${action} package ${pkg.name}`));
        }
      }
      else {
        return callback(createError(401, `usernamespace required to ${action} package ${pkg.name}`));
      }
    }.bind(this);
  }

  allow_access(user, pkg, callback) {
    this.allow_action('access')(user, pkg, callback);
  }

  allow_publish(user, pkg, callback) {
    this.allow_action('publish')(user, pkg, callback);
  }

  allow_unpublish(user, pkg, callback) {
    const action = 'unpublish';
    const isDefined = pkg[action] !== null && pkg[action] !== undefined;

    const hasSupport = isDefined ? pkg[action] : false;

    if (hasSupport === false) {
      return callback(null, undefined);
    }

    return this.allow_action(action)(user, pkg, callback);
  }
}

module.exports = (cfg, stuff) => new UserNamespacesPlugin(cfg, stuff);
