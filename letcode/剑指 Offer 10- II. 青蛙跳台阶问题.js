var numWays = function(n) {
    if(n == 1 || n==2){
        return n;
    }
    return numWays(n-1)
};
let grid=[
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0],
    [0,0,0,0,1,0,0,0],
    [1,0,1,0,0,1,0,0],
    [0,0,1,0,0,0,0,0],
    [0,0,0,1,1,0,1,0],
    [0,1,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0]
]
function countPaths(grid,row,col,record={}){
    if(grid[row][col] == 1){
        return 0;
    }
    if(row == 7 && col == 7) return 1;
    if(!record[`${row}_${col}`]){
        if(row == 7 || col == 7){
            record[`${row}_${col}`] = 1;
        }else{
            record[`${row}_${col}`]=countPaths(grid,row+1,col)+countPaths(grid,row,col+1);
        }
    }
    return record[`${row}_${col}`];
}
let root=[];
function countPaths2(grid,row,col,record={}){
    root[row][col]=root[row][col-1]+root[row-1][col];
    root[0][1]
}
console.log(countPaths(grid,7,7));