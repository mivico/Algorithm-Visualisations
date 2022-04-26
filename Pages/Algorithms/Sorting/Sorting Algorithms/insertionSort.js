async function insertionSort() {
    let n = BAR_ARRAY.length;
        for (let i = 1; i < n; i++) {
            // Choosing the first element in our unsorted subarray
            let current = BAR_ARRAY[i];
            // The last element of our sorted subarray
            let j = i-1; 
            while ((j > -1) && (current.key < BAR_ARRAY[j].key)) {
                current.object.isBeingCompared = true;
                BAR_ARRAY[j].object.isBeingCompared = true;
                await sleep(2);

                current.object.isBeingCompared = false;
                BAR_ARRAY[j].object.isBeingCompared = false;
                BAR_ARRAY[j+1] = BAR_ARRAY[j];
                j--;
            }
            BAR_ARRAY[j+1] = current;
        }
}