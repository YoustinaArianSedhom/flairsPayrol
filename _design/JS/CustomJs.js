$(document).ready(function () {

  $('.remove-role').click(function () {
    $(this).parent().hide();
  })

  $('#example').DataTable({
    "dom": '<f<t>lip>',
    'aoColumnDefs': [{
      'bSortable': false,
      'aTargets': ['no-sort'],
      "columns": [
        { "width": "20%" }
      ]

    }]
  }
  );

  $('#example-2').DataTable({
    "dom": '<f<t>lip>',
    'aoColumnDefs': [{
      'bSortable': false,
      'aTargets': ['no-sort'],
      "columns": [
        { "width": "20%" }
      ]

    }]
  }
  );

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })


  $(".form-input").focus(function () {
    $(this).next().addClass('show')
  }).focusout(function () { $(this).next().removeClass('show') })

  $('.multiple-checkboxes').multiselect({
    includeSelectAllOption: true,
    numberDisplayed: 4
  });



  $('input[type=file]').each(function () {
    var attr = $(this).attr('multiple');
    if (attr) {
      $(this).change(function () {
        var filename = ' ' + '<span>' + $(this).val().replace(/C:\\fakepath\\/i, '') + '</span>';
        var filenamelength = $('.file-name span').length;

        if (filenamelength != 0) {
          $(this).next('.file-name').append(filename);

        }
        else {
          $(this).next('.file-name').html(filename)
        }
      });


    }
    else {

      $(this).change(function () {
        var filename = $(this).val().replace(/C:\\fakepath\\/i, '');
        $(this).next('.file-name').html(filename)
      });

    }

  })



  $('.popup-btn').each(function () {
    $(this).click(function () {
      event.preventDefault();
      var popUpCont = $('.popup-wrapper');
      //$('.filter-search-cont').not(searchCont).addClass('invisible').removeClass('open');
      popUpCont.addClass('open').removeClass('hide');
      $('body').css('overflow', 'hidden')


    })

  })
  $('.x-close').each(function () {

    $(this).click(function () {
      var popUpCont = $(this).parent().parent();
      popUpCont.addClass('hide').removeClass('open');
      body.removeAttr('style')
    })

  })


  //buttons toggle

  $('.btn-toggle').each(function () {

    $(this).click(function () {
      var submenu = $(this).next();
      $(this).next().slideToggle();
      $(".user-menu").not(submenu).slideUp("slow");
      $(this).addClass('active');
      $(".user-menu").not(submenu).prev().removeClass('active');


    })
  })


  $(document).on("click", function (event) {
    var $trigger = $(".dropdown");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
      $(this).find('.user-menu').slideUp("fast");
      $(this).find('.btn-toggle').removeClass('active');
    }
  })


  //fullscreen

  $(".fullscreen_button").on("click", function () {
    event.preventDefault();
    document.fullScreenElement && null !== document.fullScreenElement || !document.mozFullScreen && !document.webkitIsFullScreen ? document.documentElement.requestFullScreen ? document.documentElement.requestFullScreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullScreen && document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen()
  });


  // toggel form
  $(document).ready(function () {
    $("#flip").click(function () {
      $("#panel").slideToggle("slow");
    });
  });










  //scroll
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();

    //>=, not <=
    if (scroll >= 150) {
      //clearHeader, not clearheader - caps H
      $(".sticky").addClass("top-nav  fadeInDown shadow-sm");
    }

    else { $(".sticky").removeClass("top-nav fadeInDown shadow-sm") }



  });



})


