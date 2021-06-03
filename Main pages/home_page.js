$("#appointment_button").click( () => {openNewTab("../book appointment/select_department.html")});
$("#test_button").click( () => {openNewTab("../test_3.html")});
$("#medicine_button").click( () => {openNewTab("../order_medicine.html")});

openNewTab = ( location ) => {
    window.open(location ,"_blank");
};