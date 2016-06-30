
var app = angular.module('AnalyticTool', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.controller('DataCtrl', ['$scope', '$http', function ($scope, $http) {

    var dataJSON = [];
    var lastContact = [];
    var responseRate;
    var approachCandidates = [];
    var filteringCandidates = [];
    var passiveCandidates = [];
    var interestedCandidates = [];
    var introducedCandidates = [];
    var tomatoTalentCandidates = [];
    var activeCandidates = [];
    var notInterestedCandidates = [];
    var intialInterested = [];
    var tomatoTalentCurrent = [];
    var mappedColor;
    var approachedColor;
    var responseColor;
    var interestedColor;
    var introducedColor;
    var tomatoColor;
    var responseCandidates = [];
    $('.navbar').css("display", "block");

    function kpiTypes(kpi, value) {
        var type;
        if (kpi == 'mapped') {
            if (value < 25) {
                type = 'danger';
                mappedColor = 'red';
            } else if (value < 50) {
                type = 'warning';
                mappedColor = 'orange';
            } else if (value < 75) {
                type = 'info';
                mappedColor = blue;
            } else if (value > 100) {
                type = 'success';
                mappedColor = 'green';
            }
            $scope.typeMapped = type;
        } else if (kpi == 'approached') {
            if (value < 20) {
                type = 'danger';
                approachedColor = 'red';
            } else if (value < 40) {
                type = 'warning';
                approachedColor = 'orange';
            } else if (value < 60) {
                type = 'info';
                approachedColor = 'blue';
            } else if (value > 90) {
                type = 'success';
                approachedColor = 'green';
            }
            $scope.typeApproached = type;
        } else if (kpi == 'response') {
            if (value < 15) {
                type = 'danger';
                responseColor = 'red';
            } else if (value < 60) {
                type = 'warning';
                responseColor = 'orange';
            } else if (value < 40) {
                type = 'info';
                responseColor = 'blue';
            } else if (value > 60) {
                type = 'success';
                responseColor = 'green';
            }
            $scope.typeResponse = type;
        } else if (kpi == 'interested') {
            if (value < 10) {
                type = 'danger';
                interestedColor = 'red';
            } else if (value < 15) {
                type = 'warning';
                interestedColor = 'orange';
            } else if (value < 20) {
                type = 'info';
                interestedColor = 'blue';
            } else if (value > 30) {
                type = 'success';
                interestedColor = 'green';
            }
            $scope.typeInterested = type;
        }
        else if (kpi == 'tomato') {
            if (value < 4) {
                type = 'danger';
                tomatoColor = 'red';
            } else if (value < 8) {
                type = 'warning';
                tomatoColor = 'orange';
            } else if (value < 12) {
                type = 'info';
                tomatoColor = 'blue';
            } else if (value > 15) {
                type = 'success';
                tomatoColor = 'green';
            }
            $scope.typeTomato = type;
        }
        else if (kpi == 'introduced') {
            if (value <= 5) {
                type = 'danger';
                introducedColor = 'red';
            } else if (value < 10) {
                type = 'warning';
                introducedColor = 'orange';
            } else if (value >= 10) {
                type = 'success';
                introducedColor = 'green';
            }
            $scope.typeIntroduced = type;
        }

        $scope.showWarning = type === 'danger' || type === 'warning';
    };
    
    var approachCtr;
    var activeCtr;
    var overviewCtr;
    $scope.selectedOption;
    $scope.options = [
         { fileName: 'dataBD.json', vacancy: 'Business Developer - Eindhoven' },
         { fileName: 'dataCMO.json', vacancy: 'CMO' },
         { fileName: 'dataHSM.json', vacancy: 'Head of Sales and Marketing' },
         { fileName: 'dataSDev.json', vacancy: 'Software Developer' },
         { fileName: 'dataVP.json', vacancy: 'VP Engineering' },
         { fileName: 'dataJLP.json', vacancy: 'Junior Leadership Pool' },
         { fileName: 'dataSLP.json', vacancy: 'Senior Leadership Pool' },
         { fileName: 'dataGHC.json', vacancy: 'Global Head of Chains' },
         { fileName: 'dataSPO.json', vacancy: 'SPO' },
         { fileName: 'dataKAMB.json', vacancy: 'Key Account Manager Benify'}
     ];

    function countingNum(num, div) {
        var s = document.getElementById(div);
        var n;
        if (num > 1000) {
            n = 0.08;
        } else if (num > 500 && num < 1000) {
            n = 0.5;
        } else if (num > 100 && num < 500) {
            n = 2;
        } else if (num > 50 && num < 100) {
            n = 5;
        } else {
            n = 10;
        }
        for (i = 0; i <= num; i++) {
            // create a closure to preserve the value of "i"
            (function (i) {
                window.setTimeout(function () {
                    s.innerHTML = '';
                    s.innerHTML = s.innerHTML + i.toString();
                }, i * n);
            }(i));
        }
    }

    var approachedChart = document.getElementById("approached");
    var activeChart = document.getElementById("active");
    var barChart = document.getElementById("barChart");
    var chartUrl;


    /*$http.get("http://reports.frontwisegroup.com/api/queryPositions").success(function (result) {
        $scope.options = [];
        angular.forEach(result.rows, function (item) {
            $scope.options.push({
                id: item.id
                , vacancy: item.name
            })
        });
    });*/

    $scope.metricCalculations = function (fileName) {
        $scope.loading = true;
        // Time calculation by position. Connected with reports.frontwisegroup.com.

       /* $http.get("http://reports.frontwisegroup.com/api/reportsQuery?filterByPosition=" + id).success(function (result) {
            $scope.totalTime = 0;
            var totalDurationInMinutes = 0;
            var connectDurationInMinutes = 0;
            var searchingDurationInMinutes = 0;

            angular.forEach(result.rows, function (item) {
                item.duration = parseInt(item.duration);
                totalDurationInMinutes += item.duration;

                if (item.jobdescName == "Searching candidates") {
                    searchingDurationInMinutes += item.duration;
                } else if (item.jobdescName == "Connect") {
                    connectDurationInMinutes += item.duration;
                }

            });
            $scope.searchingDuration = searchingDurationInMinutes / 60;
            $scope.connectDuration = connectDurationInMinutes / 60;
            $scope.totalTime = totalDurationInMinutes / 60;

        });*/

        if (fileName) {
            console.log('Content/data/' + $scope.selectedOption.fileName);
            $http.get('/Content/data/' + $scope.selectedOption.fileName).success(function (response) {
            

                $scope.dateTo = '';
                var myBarChart = null;
                var myChart = null;
                var engagedCtr = null;
                $scope.loading = false;

                var res = response;


                $scope.dateChanged = function () {
                    
                    var listBetweenDates = [];
                    angular.forEach(res, function (item) {
                        if (item.createdAt >= $scope.dateFrom && item.createdAt <= $scope.dateTo) {
                            listBetweenDates.push(item);
                        }
                    });

                    filterCandidates(listBetweenDates);
                };

                if (approachCtr != null) {
                    $('#approached').remove();
                    $('.approached').append('<canvas id="approached" width="400" height="400"></canvas>');
                    approachedChart = document.getElementById("approached");
                }

                if (activeCtr != null) {
                    $('#active').remove();
                    $('.active').append('<canvas id="active" width="400" height="400"></canvas>');
                    activeChart = document.getElementById("active");
                }

                if (barChart != null) {
                    $('#barChart').remove();
                    $('.stats').append('<canvas id="barChart" width="400" height="400"></canvas>');
                    barChart = document.getElementById("barChart");
                }

                filterCandidates(res);

                function filterCandidates(responseData) {
                    //dataJSON = [];
                    dataJSON = responseData;
                    lastContact = [];
                    approachCandidates = [];
                    filteringCandidates = [];
                    passiveCandidates = [];
                    interestedCandidates = [];
                    introducedCandidates = [];
                    tomatoTalentCandidates = [];
                    activeCandidates = [];
                    notInterestedCandidates = [];
                    intialInterested = [];
                    tomatoTalentCurrent = [];
                    responseCandidates = [];
                    $scope.introducedCandidatesNum = 0;
                    $scope.firstCandidateDate = new Date();
                    $scope.lastContactNum = 0;
                    $scope.notContactedNum = 0;
                    $scope.allContacts = 0;
                    $scope.responseRate = 0;
                    if (responseData.length == 0) {
                        $scope.firstCandidateDate = "";
                        lastContact = 0;
                    }
                    angular.forEach(responseData, function (item) {
                        if (item.lastContact != 0) {
                            lastContact.push(item);
                        }
                        item.createdAt = new Date(item.createdAt);
                        if ($scope.firstCandidateDate > item.createdAt) {
                            $scope.firstCandidateDate = item.createdAt;
                        }

                        switch (item.status) {

                            //filtering candidates
                            case 'a. filter':
                                filteringCandidates.push(item);
                                break;
                            case 'b. lead':
                                filteringCandidates.push(item);
                                break;
                            case 'c. connection request':
                                filteringCandidates.push(item);
                                break;
                            case 'd. reach out':
                                filteringCandidates.push(item);
                                break;

                                // engaged candidates 
                            case 'e. first message':
                                passiveCandidates.push(item);
                                break;
                            case 'f. 1st reminder':
                                passiveCandidates.push(item);
                                break;
                            case 'g. 2nd reminder':
                                passiveCandidates.push(item);
                                break;
                            case 'h. 3rd reminder':
                                passiveCandidates.push(item);
                                break;
                            case 'x.  not responding':
                                passiveCandidates.push(item);
                                break;

                                //in proces/interested candidates
                            case 'i. interested':
                                intialInterested.push(item);
                                interestedCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'j. interested in intro call':
                                interestedCandidates.push(item);
                                intialInterested.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'k. jd sent':
                                intialInterested.push(item);
                                interestedCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'l. call proposed':
                                intialInterested.push(item);
                                interestedCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;

                                // tomato talent interview
                            case 'm. interview scheduled':
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                tomatoTalentCurrent.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'n. tomato talent interview':
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                tomatoTalentCurrent.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'n. frontwise interview':
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                tomatoTalentCurrent.push(item);
                                responseCandidates.push(item);
                                break;

                                // introduced to cliend/client process
                            case 'o.  introduced to client':
                                introducedCandidates.push(item);
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'p.  first interview client':
                                introducedCandidates.push(item);
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'q. second interview client':
                                introducedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'r. case study':
                                introducedCandidates.push(item);
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 's. last round':
                                introducedCandidates.push(item);
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 't. offer':
                                introducedCandidates.push(item);
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'u. hire':
                                introducedCandidates.push(item);
                                interestedCandidates.push(item);
                                tomatoTalentCandidates.push(item);
                                activeCandidates.push(item);
                                responseCandidates.push(item);
                                break;

                            case 'v. reference partner':
                                interestedCandidates.push(item);
                                responseCandidates.push(item);
                                break;

                            case 'w. re-engage':
                                interestedCandidates.push(item);
                                responseCandidates.push(item);
                                break;

                            case 'z. rejected by candidate':
                                tomatoTalentCandidates.push(item)
                                introducedCandidates.push(item);
                                interestedCandidates.push(item);

                                break;
                            case 'z1. rejected by tomato':
                                tomatoTalentCandidates.push(item);
                                interestedCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'z1. rejected by talent manager':
                                tomatoTalentCandidates.push(item);
                                interestedCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'z3. on hold':
                                interestedCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'z4. not interested':
                                notInterestedCandidates.push(item);
                                responseCandidates.push(item);
                                break;
                            case 'z5. balcklist':
                                responseCandidates.push(item);
                                break;
                            case 'y. rejected by company':
                                tomatoTalentCandidates.push(item);
                                interestedCandidates.push(item);
                                responseCandidates.push(item);
                                introducedCandidates.push(item);
                                break;
                        }
                    });



                    $scope.lastContactNum = lastContact.length;
                    $scope.notContactedNum = dataJSON.length - lastContact.length;
                    $scope.allContacts = dataJSON.length;
                    $scope.responseCandidatesNum = responseCandidates.length;
                    $scope.responseRate = $scope.responseCandidatesNum / dataJSON.length * 100;
                    $scope.responseRate = Math.round($scope.responseRate * 10) / 10;
                    $scope.filteringCandidatesNum = filteringCandidates.length;

                    $scope.tomatoTalentCandidatesNum = tomatoTalentCandidates.length;

                    // approached calculations
                    $scope.approachCandidatesNum = $scope.allContacts - $scope.filteringCandidatesNum;
                    $scope.approachedPerc = $scope.approachCandidatesNum / $scope.allContacts * 100;
                    $scope.approachedPerc = Math.round($scope.approachedPerc * 10) / 10;

                    $scope.passiveCandidatesNum = passiveCandidates.length;
                    $scope.passiveCandidatesPerc = $scope.passiveCandidatesNum / $scope.approachCandidatesNum * 100;
                    $scope.passiveCandidatesPerc = Math.round($scope.passiveCandidatesPerc * 10) / 10;

                    $scope.interestedCandidatesNum = interestedCandidates.length;
                    $scope.interestedPerc = $scope.interestedCandidatesNum / $scope.approachCandidatesNum * 100;
                    $scope.interestedPerc = Math.round($scope.interestedPerc * 10) / 10;

                    $scope.notInterestedNum = notInterestedCandidates.length;
                    $scope.notInterestedPerc = $scope.notInterestedNum / $scope.approachCandidatesNum * 100;
                    $scope.notInterestedPerc = Math.round($scope.notInterestedPerc * 10) / 10;

                    // current status calculations
                    $scope.activeCandidatesNum = activeCandidates.length;

                    $scope.tomatoTalentCurrentNum = tomatoTalentCurrent.length;
                    $scope.tomatoTalentCurrentPerc = $scope.tomatoTalentCurrentNum / $scope.activeCandidatesNum * 100;
                    $scope.tomatoTalentCurrentPerc = Math.round($scope.tomatoTalentCurrentPerc * 10) / 10;

                    $scope.initialInterestedNum = intialInterested.length;
                    $scope.intialInterestedPerc = $scope.initialInterestedNum / $scope.activeCandidatesNum * 100;
                    $scope.intialInterestedPerc = Math.round($scope.intialInterestedPerc * 10) / 10;

                    $scope.introducedCandidatesNum = introducedCandidates.length;
                    $scope.introducedPerc = $scope.introducedCandidatesNum / $scope.activeCandidatesNum * 100;
                    $scope.introducedPerc = Math.round($scope.introducedPerc * 10) / 10;




                    // dates matrics 
                    var today = new Date();
                    $scope.firstIntroducedDate = today;
                    $scope.daysPassed = today.getTime() - $scope.firstCandidateDate.getTime();
                    $scope.daysPassed = $scope.daysPassed / (1000 * 60 * 60 * 24);
                    $scope.daysPassed = Math.round($scope.daysPassed);
                    if (introducedCandidates.length > 0) {
                        angular.forEach(introducedCandidates, function (item) {
                            if (item.daysInStatus != 0) {
                                item.daysInStatus = new Date(item.daysInStatus);
                                if ($scope.firstIntroducedDate > item.daysInStatus) {
                                    $scope.firstIntroducedDate = item.daysInStatus;
                                }
                            }
                        });

                        $scope.daysPassedToFirstIntro = $scope.firstIntroducedDate.getTime() - $scope.firstCandidateDate.getTime();
                        $scope.daysPassedToFirstIntro = $scope.daysPassedToFirstIntro / (1000 * 60 * 60 * 24);
                        $scope.daysPassedToFirstIntro = Math.round($scope.daysPassedToFirstIntro);
                    } else {
                        $scope.daysPassedToFirstIntro = 0;
                        $scope.firstIntroducedDate = 'none';
                    }

                    if ($scope.daysPassed < 15) {
                        $scope.kpi2Available = false;
                        $scope.kpi3Available = false;
                        $scope.kpi4Available = false;
                    } else if ($scope.daysPassed < 29) {
                        $scope.kpi2Available = true;
                        $scope.kpi3Available = false;
                        $scope.kpi4Available = false;
                    } else if ($scope.daysPassed < 43) {
                        $scope.kpi2Available = true;
                        $scope.kpi3Available = true;
                        $scope.kpi4Available = false;
                    } else {
                        $scope.kpi2Available = true;
                        $scope.kpi3Available = true;
                        $scope.kpi4Available = true;
                    }


                    $scope.dateFrom = $scope.firstCandidateDate;

                    drawApproachedChart(approachedChart);

                    countingNum($scope.allContacts, 'allContacts');

                    kpiTypes('mapped', $scope.allContacts);
                    kpiTypes('approached', $scope.approachedPerc);
                    kpiTypes('response', $scope.responseRate);
                    kpiTypes('interested', $scope.interestedPerc);
                    kpiTypes('tomato', $scope.tomatoTalentCandidatesNum);
                    kpiTypes('introduced', $scope.introducedCandidatesNum);

                    overviewCtr = new Chart(barChart, {
                        type: 'bar',
                        data: {
                            labels: ["Total", "Response", "Filtering", "Total tomato", "Approach", "Interested", "Not Interested", "Passive"],
                            datasets: [
                                {
                                    label: "Number of candidates",
                                    backgroundColor: "rgba(3,196,225,1)",
                                    borderColor: "rgba(56,40,232,1)",
                                    borderWidth: 1,
                                    hoverBackgroundColor: "rgba(3,196,225,0.4)",
                                    hoverBorderColor: "rgba(56,40,232,1)",
                                    data: [$scope.allContacts, $scope.lastContactNum, $scope.filteringCandidatesNum, $scope.tomatoTalentCandidatesNum
                                        , $scope.approachCandidatesNum, $scope.interestedCandidatesNum, $scope.notInterestedNum, $scope.passiveCandidatesNum],
                                }
                            ]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {

                                    }
                                }]
                            }
                        }
                    });

                    activeCtr = new Chart(activeChart, {
                        type: 'pie',
                        data: {
                            labels: ["Initial interested %", "Tomato talent &", "Introduced %"],
                            datasets: [{
                                label: '# of Votes',
                                data: [$scope.intialInterestedPerc, $scope.tomatoTalentCurrentPerc, $scope.introducedPerc],
                                backgroundColor: [
                                "#36A2EB",
                                "#D4161B",
                                "#77FF77"
                                ],
                                hoverBackgroundColor: [
                                "#36A2EB",
                                "#D4161B",
                                "#77FF77"
                                ]
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {

                                    }
                                }]
                            }
                        }
                    });
                }
            });

        }
    }

    function toDataUrl(url, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL('image/png');
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
    }


    var img = new Image();

    img.totalOverview = function () {
        var dataURI = barChart.toDataURL('image/png');
        return dataURI;

    }

    img.currentStatus = function () {
        var dataURI = activeChart.toDataURL('image/png');
        return dataURI;
    }

    img.candidateResponse = function () {
        var dataURI = approachedChart.toDataURL('image/png');
        return dataURI;
    }

    $scope.downloadPDF = function () {
        var doc = new jsPDF('landscape');
        var approachedColor;
        var responseColor;
        var interestedColor;
        var introducedColor;
        var tomatoColor;
        mappedColor = '0,255,0';

        doc.text(10, 15, 'Client:');
        doc.text(10, 25, 'Vacancy: ' + $scope.selectedOption.vacancy);

        doc.setFontSize(11);
        doc.text(210, 10, 'Start date: ' + $scope.firstCandidateDate);
        doc.text(210, 17, 'Days passed (start - today): ' + $scope.daysPassed);
        doc.text(210, 24, 'First candidate introduced: ' + $scope.firstIntroducedDate);
        doc.text(210, 31, 'Days passed (mapped - introduced): ' + $scope.daysPassedToFirstIntro);

        doc.setFontSize(15);
        doc.text(10, 42, 'Total overview:');
        doc.setFontSize(11);
        doc.text(10, 50, $scope.allContacts + ' Total number');
        doc.text(10, 57, $scope.approachCandidatesNum + ' Approach');
        doc.text(10, 64, $scope.lastContactNum + ' Response');
        doc.text(10, 71, $scope.passiveCandidatesNum + ' Passive');
        doc.text(10, 78, $scope.filteringCandidatesNum + ' Filtering');
        doc.text(10, 92, $scope.interestedCandidatesNum + ' Interested');
        doc.text(10, 85, $scope.tomatoTalentCandidatesNum + ' Tomato talent interviewed');
        doc.text(10, 99, $scope.notInterestedNum + ' Not interested');
        doc.addImage(img.totalOverview(), 'PNG', 10, 105, 90, 90);

        doc.setFontSize(15);
        doc.text(110, 42, 'Current status:');
        doc.setFontSize(11);
        doc.text(110, 50, $scope.activeCandidatesNum + ' Active');
        doc.text(110, 57, $scope.initialInterestedNum + ' Initial interested - ' + $scope.intialInterestedPerc + '%');
        doc.text(110, 64, $scope.tomatoTalentCurrentNum + ' Interview scheduled - ' + $scope.tomatoTalentCurrentPerc + '%');
        doc.text(110, 71, $scope.introducedCandidatesNum + ' Introduced - ' + $scope.introducedPerc + '%');

        doc.setFontSize(15);
        doc.text(210, 42, 'KPI\'s:');
        doc.setFontSize(14);
        doc.text(210, 50, '0-2 Weeks');
        doc.setFontSize(12);
        // doc.setTextColor(mappedColor);
        doc.text(210, 57, 'Candidates mapped');
        doc.setFontSize(11);
        doc.text(210, 64, $scope.allContacts + ' / 100');

        doc.setFontSize(14);
        doc.text(210, 74, '2-4 Weeks');
        doc.setFontSize(12);
        doc.text(210, 81, 'Approached');
        doc.setFontSize(11);
        doc.text(210, 88, $scope.approachedPerc + '% / 90%');
        doc.setFontSize(12);
        doc.text(210, 95, 'Reply');
        doc.setFontSize(11);
        doc.text(210, 102, $scope.responseRate + '% / 60%');
        doc.setFontSize(12);
        doc.text(210, 109, 'Interested');
        doc.setFontSize(11);
        doc.text(210, 116, $scope.interestedPerc + '% / 30%');

        doc.setFontSize(14);
        doc.text(210, 126, '4-6 Weeks');
        doc.setFontSize(12);
        doc.text(210, 133, 'Tomato interviews');
        doc.setFontSize(11);
        doc.text(210, 140, $scope.tomatoTalentCandidatesNum + ' / 15');

        doc.setFontSize(14);
        doc.text(210, 150, '6-8 Weeks');
        doc.setFontSize(12);
        doc.text(210, 157, 'Introduced');
        doc.setFontSize(11);
        doc.text(210, 164, $scope.introducedCandidatesNum + ' / 10');
        doc.addImage(img.currentStatus(), 'PNG', 110, 105, 80, 80);

        doc.addPage();
        doc.setFontSize(15);
        doc.text(10, 42, 'Candidate response:');
        doc.setFontSize(11);
        doc.text(10, 50, $scope.approachCandidatesNum + ' Approach');
        doc.text(10, 57, $scope.interestedCandidatesNum + ' Interested - ' + $scope.interestedPerc + '%');
        doc.text(10, 64, $scope.notInterestedNum + ' Not interested - ' + $scope.notInterestedPerc + '%');
        doc.text(10, 71, $scope.passiveCandidatesNum + ' Passive - ' + $scope.passiveCandidatesPerc + '%');
        doc.addImage(img.candidateResponse(), 'PNG', 10, 85, 80, 80);



        /* toDataUrl('/Content/img/tomatoTalentLogo.png', function (base64Img) {
             // Base64DataURL
             var img = new Image();
             img.logoTop = base64Img;
         });*/

        doc.save($scope.selectedOption.vacancy);

    }
    $scope.loading = false;

    $('.dataContent').css("display", "block");

    function drawApproachedChart(ctx) {
        approachCtr = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["Interested %", "Not interested %", "Passive %"],
                datasets: [{
                    label: '# of Votes',
                    data: [$scope.interestedPerc, $scope.notInterestedPerc, $scope.passiveCandidatesPerc],
                    backgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#8800FF"
                    ],
                    hoverBackgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#8800FF",
                    ]
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {

                        }
                    }]
                }
            }
        });
    }
}]);