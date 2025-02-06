(function ($) {
  "use strict";

  $(".megamenu").affix({
    offset: {
      top: 800,
      bottom: function () {
        return (this.bottom = $(".footer").outerHeight(true));
      },
    },
  });
  jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() > 1) {
      jQuery(".dmtop").css({
        bottom: "75px",
      });
    } else {
      jQuery(".dmtop").css({
        bottom: "-100px",
      });
    }
  });

  $(window).load(function () {
    $("#preloader").on(500).fadeOut();
    $(".preloader").on(600).fadeOut("slow");
  });

     jQuery(document).ready(function() {
      setTimeout(function() {
          jQuery("div[style*='background-color: white'][style*='position: absolute']").hide();
      }, 1000);
  });

  function count($this) {
    var current = parseInt($this.html(), 10);
    current = current + 50; /* Where 50 is increment */
    $this.html(++current);
    if (current > $this.data("count")) {
      $this.html($this.data("count"));
    } else {
      setTimeout(function () {
        count($this);
      }, 30);
    }
  }
  $(".stat_count, .stat_count_download").each(function () {
    $(this).data("count", parseInt($(this).html(), 10));
    $(this).html("0");
    count($(this));
  });


  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();


  jQuery(document).ready(function () {
    $("#contactForm").submit(function () {
      var action = $(this).attr("action");
      $("#message").slideUp(750, function () {
        $("#message").hide();
        $("#submit")
          .after('<img src="" class="loader" />')
          .attr("disabled", "disabled");
        $.post(
          action,
          {
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            select_service: $("#select_service").val(),
            select_price: $("#select_price").val(),
            comments: $("#comments").val(),
            verify: $("#verify").val(),
          },
          function (data) {
            document.getElementById("message").innerHTML = data;
            $("#message").slideDown("slow");
            $("#contactForm img.loader").fadeOut("slow", function () {
              $(this).remove();
            });
            $("#submit").removeAttr("disabled");
            if (data.match("success") != null)
              $("#contactForm").slideUp("slow");
          }
        );
      });
      return false;
    });
  });

  $(".code-wrapper").on("mousemove", function (e) {
    var offsets = $(this).offset();
    var fullWidth = $(this).width();
    var mouseX = e.pageX - offsets.left;

    if (mouseX < 0) {
      mouseX = 0;
    } else if (mouseX > fullWidth) {
      mouseX = fullWidth;
    }

    $(this).parent().find(".divider-bar").css({
      left: mouseX,
      transition: "none",
    });
    $(this)
      .find(".design-wrapper")
      .css({
        transform: "translateX(" + mouseX + "px)",
        transition: "none",
      });
    $(this)
      .find(".design-image")
      .css({
        transform: "translateX(" + -1 * mouseX + "px)",
        transition: "none",
      });
  });
  $(".divider-wrapper").on("mouseleave", function () {
    $(this).parent().find(".divider-bar").css({
      left: "50%",
      transition: "all .3s",
    });
    $(this).find(".design-wrapper").css({
      transform: "translateX(50%)",
      transition: "all .3s",
    });
    $(this).find(".design-image").css({
      transform: "translateX(-50%)",
      transition: "all .3s",
    });
  });


// Обработка формы

  $(document).ready(function () {
  let formSubmitted = false; 

  $("form[id^='contactForm']").on("submit", function (e) {
    e.preventDefault();

    const form = $(this);
    const submitButton = form.find("button[type='submit']");

    form.find(".error-message").remove();

    const formData = form.serialize();

    const fields = {
      firstName: form.find("input[name='first_name']").val().trim(),
      lastName: form.find("input[name='last_name']").val().trim(),
      email: form.find("input[name='email']").val().trim(),
      phone: form.find("input[name='phone']").val().trim(),
      selectService: form.find("select[name='select_service']").val(),
      selectPrice: form.find("select[name='select_price']").val(),
    };

    if (!fields.firstName) return showError("Имя обязательно", submitButton);
    if (!fields.lastName) return showError("Фамилия обязательна", submitButton);
    if (!validateEmail(fields.email)) return showError("Неверный email", submitButton);
    if (!validatePhone(fields.phone)) return showError("Неверный номер телефона", submitButton);
    if (fields.selectService === "selecttime") return showError("Пожалуйста, выберите время", submitButton);
    if (!fields.selectPrice) return showError("Пожалуйста, выберите ценовой диапазон", submitButton);

    $("form[id^='contactForm'] button[type='submit']").prop("disabled", true);

    $.ajax({
      type: "POST",
      url: "contact.php",
      data: formData,
      success: function (response) {
        if (response.success) {
          showModal(response.message);
          form.trigger("reset"); 
          formSubmitted = true;
        } else {
          showError(response.message, submitButton);
          $("form[id^='contactForm'] button[type='submit']").prop("disabled", false);
        }
      },
      error: function () {
        showError("Ошибка при отправке данных. Попробуйте позже.", submitButton);
        $("form[id^='contactForm'] button[type='submit']").prop("disabled", false);
      }
    });
  });

  function showError(message, element) {
    $("<div>")
     .addClass("error-message")
      .css({ color: "red", fontSize: "14px" })
      .text(message)
      .insertBefore(element);
  }

  function validateEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  }

  function validatePhone(phone) {
    return /^\+?[0-9]{10,15}$/.test(phone);
  }

  function showModal(message) {
    $("#modalMessage").text(message);
    $("#myModal").modal("show");

    $(".close, .btn-secondary").on("click", function () {
      $("#myModal").modal("hide");
    });
  }
});

})(jQuery);
