async function bubbleSort() {
 for(var i = 0; i < BAR_ARRAY.length; i++){
     
    // Last i elements are already in place  
    for(var j = 0; j < ( BAR_ARRAY.length - i -1 ); j++){
        
      // Checking if the item at present iteration 
      // is greater than the next iteration
      BAR_ARRAY[j].object.isBeingCompared = true;
      BAR_ARRAY[j+1].object.isBeingCompared = true;
      await sleep(1);
      if(BAR_ARRAY[j].key > BAR_ARRAY[j+1].key){
          
        // If the condition is true then swap them
        var temp = BAR_ARRAY[j]
        BAR_ARRAY[j] = BAR_ARRAY[j + 1]
        BAR_ARRAY[j+1] = temp
      }
      BAR_ARRAY[j].object.isBeingCompared = false;
      BAR_ARRAY[j+1].object.isBeingCompared = false;
    }
  }
}