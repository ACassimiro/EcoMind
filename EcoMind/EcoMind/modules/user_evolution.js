var database = require('./database.js');
var socketio = require('socket.io');

//db.progress.aggregate([{$group: {_id:'',question1: {$max: "$ecological_footprint.question9"}}}])


function processProgress(socket, req) {
	var message_to_client = {};
	database['users'].getHighestProgress('question1', function(err, qmax){
		
		if (err || !qmax) {
			message_to_client['progress'] = null;
            socket.send(JSON.stringify(message_to_client));
		} else {
			database['users'].getUserProgress(req.user_id, function(err, quser) {
				var userProgress = {water: [],
					electricity: [],
					trash: [],
					"food-waste": [],
					"car-usage": []
				};
				
				if (err || !qmax) {
					message_to_client['progress'] = null;
					socket.send(JSON.stringify(message_to_client));
				} else {
					
					for (var qu in quser) {
			
						for (var q in quser[qu].ecological_footprint) {
							if (quser[qu].ecological_footprint[q] !== null && quser[qu].ecological_footprint[q] !== undefined) {
								if (q === 'question1') {
									userProgress.water.push({date: quser[qu].timestamp, 
										progress: invertPercentage(
											calculatePercentage(Number(qmax[0].question1), Number(quser[qu].ecological_footprint[q]))
										)
									});		
								} else if (q === 'question2') {
									userProgress.electricity.push({date: quser[qu].timestamp, 
										progress: invertPercentage(
											calculatePercentage(Number(qmax[0].question2), Number(quser[qu].ecological_footprint[q]))
										)
									});
								} else if (q === 'question4') {
									userProgress.trash.push({date: quser[qu].timestamp, 
										progress: invertPercentage(
											calculatePercentage(Number(qmax[0].question4), Number(quser[qu].ecological_footprint[q]))
										)
									});
								} else if (q === 'question5') {
									userProgress["food-waste"].push({date: quser[qu].timestamp, 
										progress: invertPercentage(
											calculatePercentage(Number(qmax[0].question5), Number(quser[qu].ecological_footprint[q]))
										)
									});
								} else if (q === 'question7') {
									userProgress["car-usage"].push({date: quser[qu].timestamp, 
										progress: invertPercentage(
											calculatePercentage((Number(qmax[0].question7) * Number(qmax[0].question8)), (Number(quser[qu].ecological_footprint[q] * Number(quser[qu].ecological_footprint['question8'])))
										))
									});
								}
							}
						}
						
					}
					message_to_client['progress'] = userProgress;
					socket.send(JSON.stringify(message_to_client));
				}
			});
			
			
		}
		
	});
}

function calculatePercentage(max, userval) {
	return ((100*userval)/max);
}

function invertPercentage(val) {
	return (100 - val);
}

function requestListener(socket, req) {
  switch (req.action_type) {
        case 'processProgress':
            processProgress(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;