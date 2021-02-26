var massage = function(nums) {
    let dp={
        work:nums[0],
        ready:0
    };
    for(let i=1;i<nums.length;i++){
        dp={
            work:dp.ready + nums[i],
            ready:Math.max(dp.ready,dp.work)
        }
    }
    return Math.max(dp.ready,dp.work);
};