#ifndef SORTING_ENGINE_H
#define SORTING_ENGINE_H

#include "DeliveryRequest.h"
#include <vector>

class SortingEngine {
public:
    // Stable sort O(n log n)
    static void mergeSort(std::vector<DeliveryRequest>& requests, int left, int right);
    
    // Unstable sort O(n log n)
    static void quickSort(std::vector<DeliveryRequest>& requests, int low, int high);
    
    // Unstable sort O(n log n) by deadline for stability test comparison
    static void quickSortByDeadline(std::vector<DeliveryRequest>& requests, int low, int high);

    // Unstable sort O(n log n)
    static void heapSort(std::vector<DeliveryRequest>& requests);
    
    // Stable sort O(n^2) - Baseline comparison
    static void bubbleSort(std::vector<DeliveryRequest>& requests);

private:
    static void merge(std::vector<DeliveryRequest>& requests, int left, int mid, int right);
    static int partition(std::vector<DeliveryRequest>& requests, int low, int high);
    static int partitionByDeadline(std::vector<DeliveryRequest>& requests, int low, int high);
    static void heapify(std::vector<DeliveryRequest>& requests, int n, int i);
};

#endif // SORTING_ENGINE_H
