const express = require('express');
const routes = express();
const axios = require('axios');

routes.get('/',(req,res)=> {
  console.log("inside /")
  res.render('mainpage');
});

routes.get('/login',(req,res)=> {
  console.log("inside /login")
  res.render('login');
});

routes.post('/authenticate', (req,res)=> {
  if (req.cookies.facebookId) {
    const facebookid = req.cookies.facebookId;
    return res.json({facebookid:facebookid})
  } else {
    return res.json({facebookid:""})
  }
});

routes.get('/logout',(req,res)=> {
  res.clearCookie('facebookId',{domain:'.deseosccproject.herokuapp.com'});
  res.render('logout');
});

routes.post('/:userId/addWishList', (req, res) => {
  const userId = req.params.userId;
	let right = "public";
	if (req.body.private === 'true') {
		right = "private";
	}
  axios.post('https://cwgofznb41.execute-api.us-east-1.amazonaws.com/default/wishlist', {
    fbid: userId,
    imgUrl: req.body.img,
    purchaseUrl: req.body.url,
    name: req.body.name,
		private: req.body.private
  })
  .then(function (response) {
    console.log("successfully returned")
    return res.json({success:true});
  })
  .catch(function (error) {
    console.log(error);
    return
  });
})

routes.get('/:userId/wishlists',(req,res)=> {
  console.log("inside get wishlist")
  console.log(req.params)
  axios.get("https://cwgofznb41.execute-api.us-east-1.amazonaws.com/default/wishlist", {
    params: {
        fbid:req.params.userId
    }
  })
  .then(response => {
    console.log(response)
    found = response.data
    if (found.wishes.length == 0) {
      wish = []
    } else {
      wish = found.wishes.reverse()
    }
    if (found) {
      res.render('wishList',{
        found: found,
        error: "",
        wishes: wish,
        selfPage: true,
        userId: req.params.facebookId,
      })
    } else {
      res.send("userid not found")
    }
    return
  })
  .catch(function (error) {
    console.log(error);
  });
});


routes.post('/friendList',(req,res)=> {
	res.cookie('facebookId',req.body.facebookId,{domain:'.deseosccproject.herokuapp.com'});
  axios.get("https://cwgofznb41.execute-api.us-east-1.amazonaws.com/default/friendlist", {
    params: {
        fbid:req.body.facebookId,
        fbusername: req.body.username
    }
  })
  .then(response => {
    console.log("response is", response);
    res.json({mongooseId: response.data.mongooseId});
    return;
  })
  .catch(function (error) {
    console.log(error);
  });
});

module.exports = routes;
