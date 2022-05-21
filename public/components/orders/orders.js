myApp.controller("ordersController", [
  "$scope",
  "apiService",
  "ngDialog",
  "$state",
  "$filter",
  function ($scope, apiService, ngDialog, $state, $filter) {
    $scope.orders = [];
    $scope.clients = [];
    $scope.formObject = {};
    $scope.formObject.clientAccountNumber = {};

    $scope.months = [
      { name: "מאי", date: setMonthTime(4) },
      { name: "יוני", date: setMonthTime(5) },
      { name: "יולי", date: setMonthTime(6) },
      { name: "אוגוסט", date: setMonthTime(7) },
      { name: "ספטמבר", date: setMonthTime(8) },
      { name: "אוקטובר", date: setMonthTime(9) },
    ];
    setCurrentMonth();

    apiService.getAllClients().then(
      function (response) {
        $scope.clients = response.data;
        $scope.clients.unshift({
          firstName: "כל הלקוחות",
          accountNumber: "allClients",
        });
        $scope.formObject.client = $scope.clients[0];
      },
      function (error) {
        console.log(error);
      }
    );

    function setMonthTime(month) {
      var dateObj = {};

      var st = new Date();
      st.setHours(0, 0, 0, 0);
      st.setMonth(month, 1);

      dateObj.startDate = new Date(st);
      dateObj.endDate = new Date(st.getFullYear(), st.getMonth() + 1, 1);

      return dateObj;
    }

    $scope.showResults = function () {
      if ($scope.formObject.client.firstName === "כל הלקוחות") {
        $scope.formObject.isAllClients = true;
      } else {
        $scope.formObject.isAllClients = false;
      }

      apiService.getOrders($scope.formObject).then(
        function (response) {
          $scope.orders = response.data;
        },
        function (error) {
          // console.log(error);
        }
      );
    };

    $scope.getTotal = function () {
      var total = 0;
      for (var i = 0; i < $scope.orders.length; i++) {
        total += $scope.orders[i].total;
      }
      return total;
    };

    $scope.deleteOrder = function (orderObjectId) {
      //todo: md dialog for delete
      ngDialog
        .openConfirm({
          template:
            '\
                <div class="ngdialog-buttons deleteBox">\
                    <div class="deleteOrderContainer">\
                        <h2>למחוק הזמנה?</h2>\
                        <div class="deleteButtonsRow">\
                            <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">בטל</button>\
                            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">מחק</button>\
                        </div>\
                    </div>\
                    <div class="garbageImgBox"><img src="/images/garbage.png"/></div>\
                </div>',
          plain: true,
        })
        .then(function (success) {
          apiService.deleteOrder(orderObjectId).then(
            function (response) {
              for (var i in $scope.orders) {
                if ($scope.orders[i]["_id"] === orderObjectId) {
                  $scope.orders.splice(i, 1);
                  break;
                }
              }
            },
            function (error) {
              console.log(error);
            }
          );
        });
    };

    $scope.setCurrentMonthName = (selectedName) => {
      $scope.currentMonthName = selectedName;
    };

    $scope.handleClickOpenMailDialog = () => {
      const newScope = $scope.$new();
      $scope.mailDialog = ngDialog.open({
        template: "../components/orders/mailOrder/mailDialog.html",
        scope: newScope,
        controller: "mailOrderController",
      });
    };

    function setCurrentMonth() {
      var currentDate = new Date();
      for (var i = 0; i < $scope.months.length; i++) {
        if (
          currentDate.getMonth() === $scope.months[i].date.startDate.getMonth()
        ) {
          $scope.formObject.date = $scope.months[i].date;
          $scope.currentMonthName = $scope.months[i].name;
          return;
        }
      }
    }
  },
]);
