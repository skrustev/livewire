module = module.exports;

var 
	files = [],
	 
	path = require('path'),
	messenger = require(path.resolve(__dirname, '../messenger')),
	_ = require('lodash');
	
var getIndex = function(info){
	return _.findIndex(files, function(file){
		var result = false;
		
		if((!_.isUndefined(file.path)) && file.path.length > 0){
			result = file.path.toLowerCase() === info.path.toLowerCase();
		} else {
			result = file.id === info.id;
		}
		
		return result;
	});
};

var handlers = {
	opened: function(data){
		files.push(data);
		messenger.publish.file('contentChanged', data);
	},
	
	closed: function(info){
		
		var indexOfFileToRemove = getIndex(info);
		
		files.splice(indexOfFileToRemove, 1);
		
		var fileInfo = {};
		
		if(files.length > 0){
			fileInfo = files[files.length -1];	
		} else {
			fileInfo.isBlank = true;
		}
		
		messenger.publish.file('contentChanged', fileInfo);
	},
	
	beforeFileSelected: function(cursorInfo){
		
		for(var i=0; i < files.length; i++){
			if(files[i].path === cursorInfo.path){
				files[i].cursorPosition = cursorInfo.position;
				break;
			}
		}
	},
	
	fileSelected: function(fileInfo){
		var selectedIndex, selectedFileInfo;
		
		selectedIndex = getIndex(fileInfo);
		selectedFileInfo = files[selectedIndex];
		
		messenger.publish.file('contentChanged', selectedFileInfo);
	}
};

module.isFileOpen = function(filePath){
	var result = false;
	
	for(var i=0; i < files.length; i++){
		if(files[i].path.toLowerCase() === filePath.toLowerCase()){
			result = true;
			break;
		}
	}
	
	return result;
};
	
messenger.subscribe.file('opened', handlers.opened);
messenger.subscribe.file('closed', handlers.closed);
messenger.subscribe.file('selected', handlers.fileSelected);
messenger.subscribe.file('new', handlers.fileSelected);
messenger.subscribe.file('beforeSelected', handlers.beforeFileSelected);