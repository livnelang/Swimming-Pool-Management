myApp.controller("mailOrderController", [
  "$scope",
  "apiService",
  "ngDialog",
  function ($scope, apiService, ngDialog) {
    const fullName =
      $scope.formObject.client.firstName +
      ($scope.formObject.client.lastName
        ? ` ${$scope.formObject.client.lastName}`
        : "");
    const formattedDate = `${
      $scope.currentMonthName
    } ${new Date().getFullYear()}`;
    $scope.title = `${fullName} - ${formattedDate}`;
    $scope.handleClickSendMail = () => {
      const mailsDetails = {
        defaultMail: $scope.mainMail,
        extraMail: $scope.mailInput,
      };

      $scope.isLoading = true;
      apiService
        .sendOrdersByMail($scope.formObject, mailsDetails, $scope.title)
        .then((res) => {
          $scope.mailStatus = 200;
          $scope.mailResponseHeader = "המייל נשלח בהצלחה!";
        })
        .catch((err) => {
          $scope.mailStatus = 500;
          $scope.mailResponseHeader = "לא הצלחנו לשלוח את המייל";
          $scope.mailResponseMessage = error.data.message;
        })
        .finally(() => {
          $scope.isLoading = false;
          openMailResponseDialog();
        });
    };

    function openMailResponseDialog() {
      $scope.mailResponseDialog = ngDialog.open({
        template: "../components/orders/mailOrder/mailOrderResponse.html",
        scope: $scope,
        closeByDocument: true,
        closeByEscape: true,
        preCloseCallback: () => {
          ngDialog.close($scope.mailDialog.id);
        },
      });
    }
  },
]);
