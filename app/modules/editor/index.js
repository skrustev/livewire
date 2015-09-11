/// <reference path="../../../typings/jquery/jquery.d.ts"/>
/* global ace */

module = module.exports;

var 
  path = require('path'),
  _ = require('lodash'),
  messenger = require(path.resolve(__dirname, '../messenger')),
  editor,
  session,
  currentFile = {},
  noop = function(){},
  currentPath,
  publishFileDirty,
  editFileCount = -1,
  resetFileEditCount;
  
resetFileEditCount = function(){
  editFileCount = -1;
};
  
publishFileDirty = function(){
  // only want to publish message on first edit
  // after contents are loaded into the editor
  editFileCount++;
  if(editFileCount === 1){
    messenger.publish.file('dirty', { path: currentPath });
  } else if(editFileCount > 1){
    editFileCount = 1; // stop the count from getting too big
  }
};
  
module.load = function (mode) {

  editor = ace.edit('editor');
  editor.setOptions({
    fontSize: '18px',
    theme: 'ace/theme/github',
    showPrintMargin: false,
    highlightActiveLine: false,
    showGutter: false,
    readOnly: true
  });
  
  var showCursor = function(){
    editor.renderer.$cursorLayer.element.style.opacity = 1;
  };
  
  var hideCursor = function(){
    editor.renderer.$cursorLayer.element.style.opacity = 0;
  };
  
  var supressAceDepricationMessage = function(){
    editor.$blockScrolling = Infinity;
  };
  
  var activateEditor = function(){
    if (editor.getReadOnly()) {
      editor.setReadOnly(false);
      showCursor();
    }
  };
  
  hideCursor(/* until a file is opened or new one is created */);
    
  supressAceDepricationMessage();

  session = editor.getSession();
  session.setMode('ace/mode/' + mode);
  session.setUseWrapMode(true);

  require('./clipboard.js').init(editor);
  require('./formatting.js').init(editor);

  var onInput = function (e) { debugger;
    currentFile.contents = editor.getValue();
    messenger.publish.file('sourceChange', currentFile);
    publishFileDirty();
  };

  editor.on('input', onInput);
    
  editor.focus();
  
  var handlers = {
    
    menuNew: function(){
      activateEditor();
    },
    
    fileNew: function(){
      editor.scrollToLine(0);
      resetFileEditCount();
    },
    
    open: function(){
      resetFileEditCount();
    },
    
    pathChanged: function(fileInfo){
      currentPath = fileInfo.path;
      resetFileEditCount();
    },
    
    saved: function(pathInfo){
      resetFileEditCount();
    },
    
    selected: function(){
      resetFileEditCount();
    },
    
    contentChanged: function(fileInfo){
      var rowNumber;
      
      if(_.isObject(fileInfo)){
        
        activateEditor();
        
        currentFile = fileInfo;
        
        if(fileInfo.isBlank){
          hideCursor();
          editor.setValue('');
        } else {
          showCursor();
          editor.setValue(fileInfo.contents);
          
          if(fileInfo.cursorPosition){
            rowNumber = fileInfo.cursorPosition.row;
            editor.selection.moveCursorToPosition(fileInfo.cursorPosition);
            editor.scrollToLine(rowNumber, true /* attempt to center in editor */, true /* animate */, noop);
          }
        }
          
        editor.focus();
        editor.selection.clearSelection();
        
      }
    }
  };
  
  messenger.subscribe.menu('new', handlers.menuNew);
  
  messenger.subscribe.file('new', handlers.fileNew);
  messenger.subscribe.file('opened', handlers.open);
  messenger.subscribe.file('contentChanged', handlers.contentChanged);
  messenger.subscribe.file('pathChanged', handlers.pathChanged);
  messenger.subscribe.file('saved', handlers.saved);  
  messenger.subscribe.file('selected', handlers.selected);  
};

module.load('asciidoc');