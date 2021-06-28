const next_elem = elem => {
    elem.classList.remove("activeSection")
    document.getElementById('circle-'+elem.id).classList.remove('active');
    document.getElementById(Number(elem.id)+1).classList.add("activeSection"); 
    document.getElementById('circle-'+(Number(elem.id)+1)).classList.add('active');
}


const next = () => {
    let verified = false
    let elem = document.getElementsByClassName('activeSection')[0];
    switch(Number(elem.id)){
        case 1:
            let valid1 = true
            if(!$('#fname').val()) {$('#fnameError').show(); valid1 = false} else {$('#fnameError').hide()} 
            if(!$('#lname').val()) {$('#lnameError').show(); valid1 = false} else {$('#lnameError').hide()}
            if(!$("input[type='radio'][name='class']:checked").val()){$('#classError').show(); valid1 = false} else {$('#classError').hide()}
            $("#back").show()
            valid1 ? next_elem(elem) : null
            break
        case 2:
            let valid2 = true
            if(!$('#email').val()) {$('#emailError').show(); valid2 = false} else {$('#emailError').hide()}
            if(!$('#password').val()) {$('#passError').show(); valid2 = false} else if($('#password').val().length < 8){$('#passError2').show(); $('#passError').hide(); valid2 = false} else {$('#passError').hide(); $('#passError2').hide()}
            if(!$('#phone').val()) {$('#phoneError').show(); valid2 = false} else if(!/^[+]+\d{12}/g.test($('#phone').val())){$('#phoneError2').show(); $('#phoneError').hide(); valid2 = false} else {$('#phoneError').hide(); $('#phoneError2').hide()}
            if(valid2) {next_elem(elem); verified = true}
            break
    }

    if(Number(elem.id) == 2 && verified){
        $('#next').css({display: "none"});
        $('#submit').css({display: "block"});
        $('#back').css({'margin-top': "0%"})
    }
}

const previous_elem = elem => {
    elem.classList.remove("activeSection")
    document.getElementById('circle-'+elem.id).classList.remove('active');
    document.getElementById(Number(elem.id)-1).classList.add("activeSection"); 
    document.getElementById('circle-'+(Number(elem.id)-1)).classList.add('active');
}

const back = () => {
    let elem = document.getElementsByClassName('activeSection')[0];
    switch(Number(elem.id)){
        case 2:
            previous_elem(elem)
            $('#back').css({display: "none"});
            $('#next').css({display: "block"});
            break
        case 3:
            previous_elem(elem)
            $('#back').css({display: "block"});
            $('#submit').css({display: "none"});
            $('#next').css({display: "block"});
            break
    }
}
