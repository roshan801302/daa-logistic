#include "SortingEngine.h"

// Merge Sort implementation (stable, sorting by deadline)
void SortingEngine::merge(std::vector<DeliveryRequest>& requests, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    std::vector<DeliveryRequest> L(requests.begin() + left, requests.begin() + left + n1);
    std::vector<DeliveryRequest> R(requests.begin() + mid + 1, requests.begin() + mid + 1 + n2);

    int i = 0, j = 0, k = left;
    CompareByDeadline comp;
    
    while (i < n1 && j < n2) {
        // Use component <= to maintain stability
        // For stable sort on objects with the same deadline, we want the element that appears first (i.e from L) to be placed first.
        // Or strictly speaking, if not b < a, it means a <= b
        if (!comp(R[j], L[i])) { // R[j] is not strictly earlier, so L[i] <= R[j]
            requests[k] = L[i];
            i++;
        } else {
            requests[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        requests[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        requests[k] = R[j];
        j++;
        k++;
    }
}

void SortingEngine::mergeSort(std::vector<DeliveryRequest>& requests, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(requests, left, mid);
        mergeSort(requests, mid + 1, right);
        merge(requests, left, mid, right);
    }
}

// Quick Sort implementation (unstable, sorting by priority)
int SortingEngine::partition(std::vector<DeliveryRequest>& requests, int low, int high) {
    DeliveryRequest pivot = requests[high];
    int i = (low - 1);
    CompareByPriority comp;

    for (int j = low; j <= high - 1; j++) {
        // We want higher priority earlier:
        if (comp(requests[j], pivot) || requests[j].priority == pivot.priority) {
            i++;
            std::swap(requests[i], requests[j]);
        }
    }
    std::swap(requests[i + 1], requests[high]);
    return (i + 1);
}

void SortingEngine::quickSort(std::vector<DeliveryRequest>& requests, int low, int high) {
    if (low < high) {
        int pi = partition(requests, low, high);
        quickSort(requests, low, pi - 1);
        quickSort(requests, pi + 1, high);
    }
}

// Quick Sort implementation (unstable, sorting by deadline) for stability demonstration
int SortingEngine::partitionByDeadline(std::vector<DeliveryRequest>& requests, int low, int high) {
    DeliveryRequest pivot = requests[high];
    int i = (low - 1);
    CompareByDeadline comp;

    for (int j = low; j <= high - 1; j++) {
        // We want earlier deadline earlier:
        if (comp(requests[j], pivot) || requests[j].deadline == pivot.deadline) {
            i++;
            std::swap(requests[i], requests[j]);
        }
    }
    std::swap(requests[i + 1], requests[high]);
    return (i + 1);
}

void SortingEngine::quickSortByDeadline(std::vector<DeliveryRequest>& requests, int low, int high) {
    if (low < high) {
        int pi = partitionByDeadline(requests, low, high);
        quickSortByDeadline(requests, low, pi - 1);
        quickSortByDeadline(requests, pi + 1, high);
    }
}

// Heap Sort implementation (unstable, sorting by priority as a priority queue proxy)
void SortingEngine::heapify(std::vector<DeliveryRequest>& requests, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    CompareByPriority comp;

    // For sorting by highest priority first, our max-heap based array will end up placing the largest element at the end
    // To sort descending (highest priority first), we use a min-heap structure for the array to move smallest to end.
    // So the comparator here should consider 'smaller priority matches' to build a min-heap, which gets swapped to end.
    
    // actually it's easier to just build a min-heap based on comparing Priorities (where we want lower priority to go to root)
    if (left < n && requests[left].priority < requests[largest].priority)
        largest = left;

    if (right < n && requests[right].priority < requests[largest].priority)
        largest = right;

    if (largest != i) {
        std::swap(requests[i], requests[largest]);
        heapify(requests, n, largest);
    }
}

void SortingEngine::heapSort(std::vector<DeliveryRequest>& requests) {
    int n = requests.size();

    // Build min-heap (lowest priority at root)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(requests, n, i);

    // Swap lowest priority to the end, and heapify the reduced heap
    for (int i = n - 1; i > 0; i--) {
        std::swap(requests[0], requests[i]);
        heapify(requests, i, 0);
    }
}

// Bubble Sort implementation (stable, sorting by deadline, O(n^2) baseline)
void SortingEngine::bubbleSort(std::vector<DeliveryRequest>& requests) {
    int n = requests.size();
    CompareByDeadline comp;
    bool swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            // If the latter element has strictly smaller deadline, swap them.
            if (comp(requests[j + 1], requests[j])) {
                std::swap(requests[j], requests[j + 1]);
                swapped = true;
            }
        }
        if (!swapped)
            break;
    }
}
