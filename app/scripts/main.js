var staticUrl = 'http://www.dailyyoga.com.cn/',
    websiteUrl = 'http://o2o.dailyyoga.com.cn/signin/',
    seconds,
    timer,
    checkMobileNumber = function(mobile) {
      if(/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(mobile)) {
        $('#get_vcode').removeClass('disabled');
      } else {
        $('#get_vcode').addClass('disabled');
      }
    },
    countDown = function() {
      if(--seconds>0){
        $('#get_vcode').text('重新获取 ('+seconds+'s)');
      }else {
        clearInterval(timer);
         $('#get_vcode').removeClass('disabled').text('获取验证码');
      }
    },
    checkUserInfo = function() {
      var $name = $('#sign_up_name'),
          $mobile = $('#sign_up_mobile'),
          $code = $('#sign_up_code'),
          $company = $('#sign_up_company');
      if(!$name.val()) {
        alert('请输入您的姓名！');
        $name.focus();
        return false;
      }else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test($mobile.val())) {
        alert('请输入手机号码！');
        $mobile.focus();
        return false;
      }else if(!/[0-9]{6}$/i.test($code.val())) {
        alert('请输入验证码！');
        return false;
      }else if(!$company.val()) {
        alert('请输入您的公司名称！');
        $company.focus();
        return false;
      } else {
        return true;
      }
    },
    getVercode = function() {
      var timestamp = Math.round(new Date().getTime()/1000);
      var mobile = $('#sign_up_mobile').val();
      $.ajax({
          type: "post",
          url: websiteUrl + 'signin/getVerCode2?' + timestamp,
          cache: false,
          data : {mobile:mobile},
          jsonp: "callback",
          dataType: "jsonp",
          success: function (result) {
            if(result.status == 1) {
              alert(result.msg);
              $('#sign_up_code').prop('disabled', false);
              seconds = 60;
              $('#get_vcode').addClass('disabled').text('重新获取 ('+seconds+'s)');
              timer = setInterval(countDown, 1000);
            }
            else {
              alert(result.msg);
              $('#sign_up_mobile').focus();
              return false;
            }
          }
       });
    },
    signUp = function(){
      var timestamp = Math.round(new Date().getTime()/1000),
        name = $('#sign_up_name').val(),
        mobile = $('#sign_up_mobile').val(),
        code = $('#sign_up_code').val(),
        company = $('#sign_up_company').val();
      $.ajax({
        type: "post",
        url: websiteUrl + 'signin/signin2?'+ timestamp,
        cache: false,
        data : {name:name,mobile:mobile,code:code,companyname:company},
        jsonp: "callback",
        dataType: "jsonp",
        success: function (result) {
          $('#sign_up_btn').removeClass('disabled');
          if(result.status == 1) {
            $('#user_name').text(name);
            $('#user_mobile').text(mobile);
            $('#user_company').text(company);
            $('#dowebok').hide();
            $('#success').show();
          } else {
            alert(result.msg);
            return false;
          }
        }
      });
    };

$(function(){
  $('#sign_up_mobile').on('keyup',function(){
    checkMobileNumber($(this).val());
  }).on('blur',function(){
    checkMobileNumber($(this).val());
  });

  $('#get_vcode').on('click', getVercode);

  $('#sign_up_btn').on('click', function() {
    if(checkUserInfo()) {
      $('#sign_up_btn').addClass('disabled');
      signUp();
    }
  });


  $('#dowebok').fullpage();
});


