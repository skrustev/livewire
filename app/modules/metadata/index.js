module = module.exports;

// var 
// 	row = "<tr><td><%= shortcut %></td><td><%= description %></td></tr>",
// 	html = '',
// 	
// 	ipc = require('ipc'),
// 	isMac = false,
// 	isPC = true,
// 	
// 	shortcuts = require('./shortcuts.js'),
// 	path = require('path'),
// 	messenger = require(path.resolve(__dirname, '../messenger')),
// 	
// 	$helpContainer = $('#help-container'),
// 	$shortcutsTbody = $('#shortcuts-tbody'),
// 	$helpClose = $('#help-close-button');
// 
// ipc.on('isMac', function(e){
// 	isMac = true;
// 	isPC = false;
// });

$(function(){
	
	// $helpContainer = $('#help-container');
	// $shortcutsTbody = $('#shortcuts-tbody');
	// $helpClose = $('#help-close-button');
	// 
	// shortcuts.forEach(function(shortcut){
	// 	html += row
	// 			.replace('<%= shortcut %>', shortcut.shortcut)
	// 			.replace('<%= description %>', shortcut.description);
	// });
	// 
	// if(isMac){
	// 	html = html.replace(/CmdOrCtrl/gi, 'cmd');
	// }
	// 
	// if(isPC){
	// 	html = html.replace(/CmdOrCtrl/gi, 'ctrl');		
	// }
	// 
	// $shortcutsTbody.html(html);
	// 
	// $helpClose.click(function(){
	// 	handlers.helpToggle();
	// });
	
	$("#editMetadata").on('click', function(e){
		$("#editMetadataDialog").modal();
	});
	
	// var handlers = {
	// 	helpToggle: function(){
	// 		$helpContainer.toggle('fast');
	// 	}
	// };
	// 
	// messenger.subscribe.dialog('help.open', handlers.helpToggle);
});
