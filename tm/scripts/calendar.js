/*global document, alert, prompt, localStorage */

    var monthstr = [ "January", "February", "March", "April", "May", "June",    "July", "August", "September", "October", "November", "December" ];

    var days_days;

    var table = document.getElementById("month-panel"); 
    var cells = table.getElementsByTagName("td"); 
    var btn_back = document.getElementById("nav-back");
    var btn_forward = document.getElementById("nav-forward");
    var monthlb = document.getElementById("nav-month");
    var rangelb = document.getElementById("sel-range");
    var namelb = document.getElementById("emp-name");
    var companylb = document.getElementById("emp-company");
    var joblb = document.getElementById("emp-job");

    var cur_month, cur_year;
    var today = new Date();
    var sel_date1 = new Date(0);
    var sel_date2 = new Date(0);
    var sel_mode = 0;

    function initialize_calendar() {
        
        cur_month = today.getMonth();
        cur_year = today.getFullYear();
        
        localStorage.setItem( 'today777', get_date_str( today ) );
        
        show_month( cur_month, cur_year );

        var name = localStorage.getItem( 'name777' );
        if ( name == null ) {
            
            name = prompt('Please enter your name' );
            if ( name == "" || name == null ) name = "Click here to enter your name";
            localStorage.setItem( 'name777', name );
        }
        namelb.innerHTML = name;

        var company = localStorage.getItem( 'company777' );
        if ( company == null ) {
            
            company = prompt('Please enter your company' );
            if ( company == "" || company == null ) company = "Click here to enter your company";
            localStorage.setItem( 'company777', company );
        }
        companylb.innerHTML = company;

        var job = localStorage.getItem( 'job777' );
        if ( job == null ) {
            
            job = prompt('Please enter your job' );
            if ( job == "" || job == null ) job = "Click here to enter your job";
            localStorage.setItem( 'job777', job );
        }
        joblb.innerHTML = job;

        btn_back.onclick = function( ) { nav_back(); }
        btn_forward.onclick = function( ) { nav_forward(); }
        monthlb.onclick = function( ) {  reset_selection(); }
        rangelb.onclick = function ( ) {
            
            if ( sel_mode == 2 ) {
                
                var days = prompt('Please enter number of days:', String( days_days ));
                
                if ( ( days != null ) && ( !isNaN( days ) ) ) {
                    
                    days_days = Number( days );
                    rangelb.innerHTML = get_range_str( sel_date1, sel_date2, days_days );
                    localStorage.setItem( 'days777', String( days_days ) );
                }
            }
        }
        namelb.onclick = function( ) {

            name = prompt('Please enter your name', name);
            if ( name == "" || name == null ) name = "Click here to enter your name";
            localStorage.setItem( 'name777', name );
            this.innerHTML = name;
        }
       
        companylb.onclick = function( ) {
           
            company = prompt('Please enter your company', company);
            if ( company == "" || company == null ) company = "Click here to enter your company";
            localStorage.setItem( 'company777', company );
            this.innerHTML = company;
        }
        
        joblb.onclick = function( ) {
           
            job = prompt('Please enter your job', job);
            if ( job == "" || job == null ) job = "Click here to enter your job";
            localStorage.setItem( 'job777', job );
            this.innerHTML = job;
        }

        for ( var i = 0; i < cells.length; i++ ) {
            
            cells[ i ].onclick = function( i ) {
                return function () { select_date(i); };
            } ( i );
            
            cells[ i ].onmouseover = function( i ) {
                return function () { hover_date(i); };
            } ( i );
        }
    }
    
    function get_num_days( month, year ) {
        
        var num_days;

        if ( month == 1 ) {
            
            num_days = 28;
            
            if ( ( year % 4 == 0 ) && !( ( year % 100 == 0 ) ^ ( year % 400 == 0 ) ) )
                num_days += 1;
        } else if ( month % 2 ) {
        
            num_days = 30;
        } else {
            
            num_days = 31;
        }
        
        return num_days;
    }
    
    function show_month( month, year ) {
        
        var date = new Date(0);
        
        date.setFullYear( year, month, 1 );

        //
        // Fix the first day to be Sunday.
        //
        
        var first_day_idx = ( date.getDay() + 6 ) % 7;
        var num_days = get_num_days( month, year );
        var days_before_first = first_day_idx;
        var days_after_last = 42 - days_before_first - num_days;
        var i, idx = 0;
        
        //
        // Set initial classes.
        //
        
        for ( i = 0; i < 42; i++ ) {
		
			cells[ i ].className = "def-cell";
            if ( ( ( i % 7 ) == 5 ) || ( ( i % 7 ) == 6 ) ) {
        
                cells[ i ].className += " red-cell";
            }
		}
        
        num_days = get_num_days( month == 0 ? 11 : month - 1, month == 0 ? year - 1 : year );
        for ( i = 0; i < days_before_first; i++ ) {
            
            cells[ idx ].innerHTML = num_days - days_before_first + i + 1;
            cells[ idx ].className += " opaque-cell";
            idx++;
        }

        num_days = get_num_days( month, year );
        for ( i = 0; i < num_days; i++ ) {
         
            cells[ idx ].innerHTML = i + 1;
            idx++;
        }

        for ( i = 0; i < days_after_last; i++ ) {
            
            cells[ idx ].innerHTML = i + 1;
            cells[ idx ].className += " opaque-cell";
            idx++;
        }

		if ( sel_mode != 0 ) {
            
            date.setFullYear( cur_year, cur_month, 1 );

			for ( i = 0; i < num_days; i++ ) {

				date.setFullYear( cur_year, cur_month, i + 1 );
                
                if ( ( ( sel_date1 <= date ) && ( date <= sel_date2 ) ) ||
                     ( ( sel_date2 <= date ) && ( date <= sel_date1 ) ))
                    cells[ first_day_idx + i ].className += " sel-cell";
			}
        }

        monthlb.innerHTML = monthstr[ month ] + " " + year;
    }

    function reset_selection( ){
        
        sel_mode = 0;
        rangelb.innerHTML = "-";
        show_month( cur_month, cur_year );
    }
    
    function nav_back( ) {

        if ( cur_month == 0 ) {
        
            cur_month = 11;
            cur_year -= 1;
        } else {

            cur_month -= 1;
        }

        show_month( cur_month, cur_year );
    }

    function nav_forward( ) {

        if ( cur_month == 11 ) {
        
            cur_month = 0;
            cur_year += 1;
        } else {

            cur_month += 1;
        }
        
        show_month( cur_month, cur_year );
    }

	function date_diff( date1, date2 ) {
	
        var time_diff = Math.abs( date2.getTime() - date1.getTime() );
		var days_diff = Math.ceil( time_diff / ( 1000 * 3600 * 24 ) );

		return days_diff + 1;
	}

    function num_off_days( date1, date2 ) {
        
        var days_range = date_diff( date1, date2 );
        var first_day = date1 > date2 ? date2.getDay() : date1.getDay();
        var off_days = 0;
        var i;

        for ( i = 0; i < days_range; i++ )
            if ( ( ( first_day + i ) % 7 == 0 ) || ( ( first_day + i ) % 7 == 6 ) )
                off_days += 1;
        
        return off_days;
    }

    function get_date_str( date ) {
        
        return date.getDate() + "." + (date.getMonth()+1) + "." +     date.getFullYear();
    }

    function get_range_str( date1, date2, num_days ) {
        
        var str_from, str_to;

        if ( date1 > date2 ) {
            
            str_from = get_date_str( date2 );
            str_to = get_date_str( date1 );        
        } else {

            str_from = get_date_str( date1 );
            str_to = get_date_str( date2 );
        }
        
        return str_from + " - " + str_to + "(incl) " + num_days + " days";
    }

	function select_date( cell_idx ) {
        
        var date = new Date(0);
        
        date.setFullYear( cur_year, cur_month, 1 );

        //
        // Fix the first day to be Sunday.
        //
        
        var first_day_idx = ( date.getDay() + 6 ) % 7;
        var num_days = get_num_days( cur_month, cur_year );
        var day_selected = cell_idx - first_day_idx + 1;
        
        //
        // Don't allow to select date from another month.
        //
        
        if ( ( cell_idx < first_day_idx ) || ( cell_idx >= first_day_idx + num_days) ) return;

        if ( sel_mode == 0 ) {

            sel_date1.setFullYear( cur_year, cur_month, day_selected );
            sel_date2.setFullYear( cur_year, cur_month, day_selected );
            sel_mode = 1;
            rangelb.innerHTML = "-";

        } else if ( sel_mode == 1 ) {
            
            sel_date2.setFullYear( cur_year, cur_month, day_selected );
            sel_mode = 2;
            days_days = date_diff( sel_date1, sel_date2 ) - num_off_days( sel_date1, sel_date2 );
            rangelb.innerHTML = get_range_str( sel_date1, sel_date2, days_days );
            localStorage.setItem( 'days777', String( days_days ) );
            
            if ( sel_date1 > sel_date2 ) {
                
                localStorage.setItem( 'from777', get_date_str( sel_date2 ) );
                localStorage.setItem( 'to777', get_date_str( sel_date1 ) );
            } else {
                
                localStorage.setItem( 'from777', get_date_str( sel_date1 ) );
                localStorage.setItem( 'to777', get_date_str( sel_date2 ) );
            }
        } else if ( sel_mode == 2 ) {
            
            sel_date1.setFullYear( cur_year, cur_month, day_selected );
            sel_date2.setFullYear( cur_year, cur_month, day_selected );
            sel_mode = 1;
            rangelb.innerHTML = "-";
        } else {

            sel_mode = 0;
            rangelb.innerHTML = "-";
        }

		show_month( cur_month, cur_year );
	}

    function hover_date( cell_idx ) {
        
        var date = new Date(0);
        
        date.setFullYear( cur_year, cur_month, 1 );

        //
        // Fix the first day to be Sunday.
        //
        
        var first_day_idx = ( date.getDay() + 6 ) % 7;
        var num_days = get_num_days( cur_month, cur_year );
        var day_selected = cell_idx - first_day_idx + 1;
        
        //
        // Don't allow to select date from another month.
        //
        
        if ( ( cell_idx < first_day_idx ) || ( cell_idx >= first_day_idx + num_days) ) return;
        
        if ( sel_mode == 1 ) {
            
            sel_date2.setFullYear( cur_year, cur_month, day_selected );
        }

		show_month( cur_month, cur_year );

        cells[ cell_idx ].className = "def-cell hov-cell";
	}

    initialize_calendar();