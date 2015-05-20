$(function() {
  'use strict';

  var uuJS = new $.UUJS();


  $(document).on('click', 'a:not(.external)', function(e) {
    e.preventDefault();
  });

  $(document).on('click', '#refresh-status', function() {
    uuJS.status();
  });

  var statusDetails = {

    onStart: function () {
      $('#account-status span, #account-dns span, #account-ip span').html('<i class="fa fa-circle-o-notch fa-spin text-muted"></i>');
    },

    onSuccess: function (data) {
      $('#account-dns').find('span').html((data.our_dns) ? 'is setup' : '<a href="http://vpn.ht/smartdns-setup" target="_blank" class="external">Update DNS</a>');
      $('#account-ip').find('span').html((data.is_known) ? '(allowed) ' + data.ip + ' - <a href="https://smartdns.vpn.ht/logout" target="_blank" class="external">remove</a>' : '<a href="https://smartdns.vpn.ht" target="_blank" class="external">Login & Update IP address</a> ');
    },

    onFail: function (xhr, status, error) {
    }

  };

  uuJS.subscribe(statusDetails);

  uuJS.status();

});
