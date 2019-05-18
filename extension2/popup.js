document.addEventListener('DOMContentLoaded', function(a) {
  let allURL = [];
  let mongooseid = "";
  $.ajax({
    url:'https://deseosccproject.herokuapp.com/authenticate',
    method:'post',
    success:function(response) {
      if (response.facebookid !== "") {
        console.log("facebook id is in the cookie")
        mongooseid = response.facebookid;
        chrome.browserAction.setIcon({path: "color.png"});
        chrome.browserAction.onClicked.addListener(function(activeTab) {
          window.open('https://deseosccproject.herokuapp.com/'+mongooseid+'/wishlists');
        })
      } else {
        chrome.browserAction.onClicked.addListener(function(activeTab) {
          window.open('https://deseosccproject.herokuapp.com/');
        })
      }
    },
    error:function(err) {
      alert("error");
    }
  })

  function onClickPublicHandler(e,tabs) {
    if (e.mediaType === "image") {
      $.ajax({
        url:"https://deseosccproject.herokuapp.com/"+mongooseid+"/addWishList",
        method:"post",
        data:{
          img:e.srcUrl,
          url:e.pageUrl,
          name:tabs.title,
          private: false
        },
        success: function(res) {
          if (res.success) {
            alert("Your wish has been saved to public!")
          }
        }
      })
    }
  };

  function onClickPrivateHandler(e,tabs) {
    if (e.mediaType === "image") {
      $.ajax({
        url:"https://deseosccproject.herokuapp.com/"+mongooseid+"/addWishList",
        method:"post",
        data:{
          img:e.srcUrl,
          url:e.pageUrl,
          name:tabs.title,
          private: true
        },
        success: function(res) {
          if (res.success) {
            alert("Your wish has been saved to private!")
          }
        }
      })
    }
  };

  chrome.runtime.onInstalled.addListener(function() {
    var parent = chrome.contextMenus.create({"title": "Choose your wish list", "contexts": ["image"]});
    chrome.contextMenus.create({"title": "Save to public", "parentId": parent, "contexts": ["image"],"onclick": onClickPublicHandler});
    chrome.contextMenus.create({"title": "Save to private", "parentId": parent, "contexts": ["image"], "onclick": onClickPrivateHandler});
  });
});
