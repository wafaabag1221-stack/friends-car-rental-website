$(document).ready(function() {
    $(".show-details-cb").change(function() {
        var rowId = $(this).val();
        $("#details-" + rowId).toggle(this.checked);
    });

    $("#continueBtn").click(function() {
        var selectedCount = $(".car-select-cb:checked").length;
        if (selectedCount === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل للمتابعة.");
        } else {
            $("#bookingFormSection").show();
            $('html, body').animate({
                scrollTop: $("#bookingFormSection").offset().top
            }, 500);
        }
    });

    $("#bookingForm").submit(function(event) {
        event.preventDefault();

        var fullName = $("#fullName").val().trim();
        var nationalId = $("#nationalId").val().trim();
        var startDateStr = $("#startDate").val();
        var endDateStr = $("#endDate").val();
        var mobile = $("#mobile").val().trim();
        var email = $("#email").val().trim();

        var nameRegex = /^[\u0621-\u064A\s]+$/;
        if (!nameRegex.test(fullName)) {
            alert("خطأ: يجب أن يتضمن الاسم الكامل أحرف هجائية عربية فقط.");
            return false;
        }

        var nationalIdRegex = /^(0[1-9]|1[0-4])\d{9}$/;
        if (!nationalIdRegex.test(nationalId)) {
            alert("خطأ: الرقم الوطني يجب أن يتألف من 11 خانة وتبدأ أول خانتين برمز صحيح بين 01 و 14.");
            return false;
        }

        if (!startDateStr || !endDateStr) {
            alert("خطأ: تاريخ البداية والنهاية إلزاميان.");
            return false;
        }

        var startDate = new Date(startDateStr);
        var endDate = new Date(endDateStr);

        if (endDate <= startDate) {
            alert("خطأ: يجب أن يكون تاريخ نهاية التأجير لاحقاً لتاريخ البداية.");
            return false;
        }

        var diffTime = Math.abs(endDate - startDate);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (mobile !== "") {
            var mobileRegex = /^09(3[0-9]|4[0-9]|5[0-9]|6[0-9]|8[0-9]|9[0-9])\d{6}$/;
            if (!mobileRegex.test(mobile)) {
                alert("خطأ: رقم الموبايل يجب أن يطابق شبكتي Syriatel أو MTN.");
                return false;
            }
        }

        if (email !== "") {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("خطأ: البريد الإلكتروني غير صالح.");
                return false;
            }
        }

        var totalPrice = 0;
        var summaryText = "ملخص طلب الحجز:\n";
        summaryText += "الاسم: " + fullName + "\n";
        summaryText += "الرقم الوطني: " + nationalId + "\n";
        summaryText += "مدة التأجير: " + diffDays + " يوم\n\n";

        $(".car-select-cb:checked").each(function() {
            var carModel = $(this).data("model");
            var carPrice = parseFloat($(this).data("price"));
            var carTotal = carPrice * diffDays;
            totalPrice += carTotal;
            summaryText += carModel + " | الإجمالي: " + carTotal + " ل.س\n";
        });

        var discount = 0;
        if (diffDays > 7) {
            discount = totalPrice * 0.10;
            summaryText += "\nالمبلغ الإجمالي: " + totalPrice + " ل.س";
            summaryText += "\nخصم (10% لتجاوز 7 أيام): " + discount + " ل.س";
            summaryText += "\nالمبلغ النهائي: " + (totalPrice - discount) + " ل.س";
        } else {
            summaryText += "\nالمبلغ النهائي: " + totalPrice + " ل.س";
        }

        alert(summaryText);
        return true;
    });
});