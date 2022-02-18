(function () {
	$('.list-selectbtn').on('click',function () {
		$(this).parents('.wpc-form-listbox').addClass('is-active');
	})
	$('.wpc-form-listbox').on('mouseleave',function () {
		$(this).removeClass('is-active');
	})
	$('.lnb-depth1').on('click',function () {
		$('.lnb button').removeClass('current');
		$(this).addClass('current');
	})
	$('.hmg-form-select select').selectmenu();
})();
