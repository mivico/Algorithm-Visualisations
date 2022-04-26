async function quickSort(left, right) {
    var index;
    if (BAR_ARRAY.length > 1) {
        index = await partition(left, right); //index returned from partition
        if(left < index - 1 && index < right) {
            await Promise.all([quickSort(left, index - 1), quickSort(index, right)])
        } else if (left < index - 1) { //more elements on the left side of the pivot
            await quickSort(left, index - 1);
        } else if (index < right) { //more elements on the right side of the pivot
            await quickSort(index, right);
        }
    }
    return;
}


async function swap(left, right) {
    BAR_ARRAY[left].object.isBeingCompared = true;
    BAR_ARRAY[right].object.isBeingCompared = true;
    await sleep(2);
    var temp = BAR_ARRAY[left];
    BAR_ARRAY[left] = BAR_ARRAY[right];
    BAR_ARRAY[right] = temp;

    const tempIndex = BAR_ARRAY[left].object.index;
    BAR_ARRAY[left].object.index = BAR_ARRAY[right].object.index;
    BAR_ARRAY[right].object.index = tempIndex;

    BAR_ARRAY[left].object.isBeingCompared = false;
    BAR_ARRAY[right].object.isBeingCompared = false;
}

async function partition(left, right) {
    const halfPoint = Math.floor((right + left) / 2);
    var pivot   = BAR_ARRAY[halfPoint].key, //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    //BAR_ARRAY[halfPoint].object.isPivot = true;
    while (i <= j) {
        while (BAR_ARRAY[i].key < pivot) {
            i++;
        }
        while (BAR_ARRAY[j].key > pivot) {
            j--;
        }
        if (i <= j) {
            await swap(i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    //BAR_ARRAY[halfPoint].object.isPivot = false;
    return i;
}