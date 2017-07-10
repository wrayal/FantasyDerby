angular.module('FantasyDerbyApp')
  .controller('ViewUsersCtrl', function (Users) {
    viewUsersCtrl=this;

    viewUsersCtrl.users=Users.getAllUsers();

  });