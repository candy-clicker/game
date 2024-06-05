function show_ad(){
         gdsdk.showAd();
}

function show_rev_ad() {
  gdsdk.showAd('rewarded')
  .then(response => {
  // Ad process done. You can track "SDK_REWARDED_WATCH_COMPLETE" event if that event triggered, that means the user watched the advertisement completely, you can give reward there.
    rew_ad_result = "rewarded"
})
    .catch(error => {
       // An error catched. Please don't give reward here.
       rew_ad_result = "error"
     })




}
