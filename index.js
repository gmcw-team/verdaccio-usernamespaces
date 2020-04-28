const createError = require('http-errors');

class UserNamespacesPlugin {
  constructor(config, stuff) {
    this.logger = stuff.logger;
    this.config = config;
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

      if (orgEnd > 0) {
        const orgName = pkgFullName.slice(1, orgEnd);
        const pkgName = pkgFullName.slice(orgEnd+1);
      }
      else {
        const pkgName = pkgFullName;
      }

      if (userName) {
        if (pkg[action].includes('$usernamespace') && pkgName.startsWith(userName + ".")) {
          return callback(null, true);
        }
        else {
          return callback(createError(401, `authorization required to ${action} package ${pkg.name}`));
        }
      }
      else {
        return callback(createError(401, `authorization required to ${action} package ${pkg.name}`));
      }
    };
  }

  allow_access(user, pkg, callback) {
    this.allow_action('access')(user, pkg, callback);
  }

  allow_publish(user, pkg, callback) {
    this.allow_action('publish')(user, pkg, callback);
  }

  allow_unpublish(user, pkg, callback) {
    const action = 'unpublish';
    const isDefined = pkg[action] === null || pkg[action] === undefined;

    const hasSupport = isDefined ? pkg[action] : false;

    if (hasSupport === false) {
      return callback(null, undefined);
    }

    return this.allow_action(action)(user, pkg, callback);
  }
}

module.exports = (cfg, stuff) => new UserNamespacesPlugin(cfg, stuff);
