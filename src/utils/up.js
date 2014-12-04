var up = angular.module('up', [])
  .directive('upDropzone', function () {
    function capture(objs, onDrop){
      var files = [],
          inQueue = files.length;
      for (var i = 0; i < objs.length; i++) {
        (function(o){
          var reader = new FileReader();
          reader.onload = function (e) {
            files.push({
              'lastModified': o.lastModified,
              'lastModifiedDate': o.lastModifiedDate,
              'timeStamp': e.timeStamp,
              'name': o.name,
              'type': o.type || "",
              'data': e.target.result,
              'size': e.total
            });
            if (--inQueue <= 0) {
              onDrop(files);
            }
          };
          reader.readAsText(o);
        })(objs[i]);
      }  
    }
    return {
      scope: {
        onDrop: '=upOndrop',
        onDropClass: '=upOndropClass'
      },
      link: function (scope, $el, attrs) {
        var el = $el[0];
        el.addEventListener('click', function(e){
          var fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.style.display = 'none';
          $('body').append(fileInput);
          fileInput.click();
          $(fileInput).change(function(e){
            capture(e.target.files, scope.onDrop || angular.noop);
          });
        }, false);
        el.addEventListener('drop', function(e){
          e.preventDefault();
          e.stopPropagation();
          if(scope.onDropClass){
            $el.removeClass(scope.onDropClass);
          }
          capture(e.dataTransfer.files, scope.onDrop || angular.noop);
        }, false);
        el.addEventListener('dragover', function(e){
          e.stopPropagation();
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }, false);
        if(scope.onDropClass){
          el.addEventListener('dragenter', function(e){
            for (var i = 0; i < e.dataTransfer.types.length; i++) {
              if (e.dataTransfer.types[i] == "Files") {
                $el.addClass(scope.onDropClass);
                break;
              }
            }
          }, false);
          el.addEventListener('dragleave', function(e){
            $el.removeClass(scope.onDropClass);
          }, false);
        }
      }
    };
  });