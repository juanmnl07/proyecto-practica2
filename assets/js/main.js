(function($){

	var radio = $('input[type=radio'),
		salaryLabel = $('#salaryLabel'),
		salarySize = $('#salarySize'),
		ageLabel = $('#ageLabel'),
		ageSize = $('#ageSize');

	radio.click(function(){
		var radioName = $(this).attr('name'),
			radioVal = $(this).val();
	
		if (radioName === 'salary' && radioVal === 'size') {
			ageLabel.prop('checked', true);
		} else if (radioName === 'salary' && radioVal === 'label') {
			ageSize.prop('checked', true);
		} 

		if (radioName === 'age' && radioVal === 'size') {
			salaryLabel.prop('checked', true);
		} else if (radioName === 'age' && radioVal === 'label') {
			salarySize.prop('checked', true);
		}
	}); 

	$.ajax({
		url : '/get-data',
		type : 'GET',
		dataType : 'json',
		success : function(response){
			if (response) {
			 	var data = response.data;
				$('#send').on('click', function(e){
				e.preventDefault();
		
	
				var salaryOption = $('input[name=salary]:checked').val(),
					ageOption = $('input[name=age]:checked').val(),
					sexOption = $('input[name=sex]:checked').val();


			$('.container div').css({
				'width' : '150px',
				'height' : '150px'
			});

			

			for (var i = data.length - 1; i >= 0; i--) {
				var circleId = "#" + data[i].Circle,
					circleWidth = $(circleId).width();
					circleHeight = $(circleId).height();
					nameId = $('<h3></h3>', {
						id : 'labelOption'
					}),
					age = data[i].Age,
					name = data[i].Name,
					gender = data[i].Sex,
					salary = data[i].Salary;

					$(circleId).empty();
					$(nameId).text(name);
					nameId.appendTo(circleId);
					var color = 'red';

					if (gender === 'male') {
						color = 'blue';
					}

					if (sexOption === 'border') {
						$(circleId).css({
							'border' : '5px solid ' + color,
							'backgroundColor' : '#FF6E00'
						});
					} else {
						$(circleId).css({
							'backgroundColor': color,
							'border' : 'none'
						});
					}

					var widthSalary = circleWidth + (salary / 50),
						heightSalary = circleHeight + (salary / 50),
						widthAge = circleWidth + (age / 1),
						heightAge = circleHeight + (age / 1); 


					if (salaryOption === 'size') {
						
						$(circleId).animate({
							'width' : widthSalary + 'px',
							'height' : heightSalary + 'px'
						});

						$('<h3></h3>', {
							text: age
						}).appendTo(circleId);
					} else {

						$(circleId).animate({
							'width' : widthAge + "px",
							'height' : heightAge + "px"
						});

						$('<h3></h3>', {
							text: salary + '$'
						}).appendTo(circleId);
					}
			}

			

		});

			$('.container').animate({
				'opacity' : 1
			})

			} else {					// end if ajax
				console.log('error');
			}
		}

	});


	
})(jQuery);

