(function ($, window) {

	window.addFormForCollection = function ($collectionHolder, $newBtn, settings) {
		let prototype = $collectionHolder.data('prototype');
		let index = $collectionHolder.data('index')+1;

		let rep = new RegExp(settings.prototypeName,"g");
		let newForm = prototype.replace(rep, index);

		$collectionHolder.data('index', index);
		let $newFormLi = $('<li></li>').append(newForm);
		$newFormLi.data('index',index);
		if ($collectionHolder.hasClass('list-group')) $newFormLi.addClass('list-group-item');
		addDeleteLinkCollection($newFormLi, settings.delBtnText);
		$newBtn.before($newFormLi);
		return $newFormLi;
	};

	window.addDeleteLinkCollection = function($tagFormLi, btnText) {
		let $removeFormA = $('<a class="btn btn-danger" href="#">'+btnText+'</a>');
		$tagFormLi.append($removeFormA);

		$removeFormA.on('click', function(e) {
			e.preventDefault();
			myDialogBox({
				id:'ForDelete',
				title: deleteConfirmTitle,
				content: deleteConfirmText,
				buttons : [
					{label: confirmButtonText, class:'danger', action:function(e) { $('#generalDialogBoxForDelete').modal('hide'); $tagFormLi.remove(); }},
					{label: cancelButtonText, action:'close', class:'info'}
				],
			});
		});
	};

	$.fn.collection = function(settings)
	{
		settings = $.extend({ addBtnText:addButtonText, prototypeName:'__name__', delBtnText:delButtonText, afterAction:function(){} }, settings);

		let $collectionHolder = this;
		let $addTagLink = $('<a class="btn btn-success" href="#" class="addCollectionLink">'+settings.addBtnText+'</a>');
		let $newBtn = $('<li class="addCollBtn text-center"></li>').append($addTagLink);

		$collectionHolder.find('>li').each(function() { addDeleteLinkCollection($(this), settings.delBtnText); });

		if ($collectionHolder.hasClass('list-group')) $newBtn.addClass('list-group-item');

		let maxIndex = 0;
		this.find('li').each(function () {
			if ($(this).data("index")>maxIndex) maxIndex = $(this).data("index");
		});
		$collectionHolder.data('index',maxIndex);

		$collectionHolder.append($newBtn);

		$addTagLink.on('click', function(e) {
			// prevent the link from creating a "#" on the URL
			e.preventDefault();

			// add a new tag form (see next code block)
			let $newForm = addFormForCollection($collectionHolder, $newBtn, settings);

			settings.afterAction($newForm);
		});

	};

	window.collectionPrepeare = function ($formId, $pname) {
		function afterAddItem($addedElement, source)
		{
			if (typeof ['window.'+$formId+'_collect_function'] === 'function')
			{
				['window.'+$formId+'_collect_function']($addedElement, source);
			}
		}
		$('#collection_type_'+$formId).collection({addBtnText:addButtonText, prototypeName:$pname, delBtnText:'<i class="fa fa-times"></i>', afterAction:afterAddItem});
		$("#collection_type_"+$formId+" li:not(.addCollBtn)").each(function () { afterAddItem($(this),"still"); });
	};
	
})(jQuery, window);