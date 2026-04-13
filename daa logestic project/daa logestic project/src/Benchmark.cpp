#include "Benchmark.h"
#include "SortingEngine.h"
#include <chrono>
#include <iostream>
#include <random>
#include <iomanip>
#include <algorithm>

std::vector<DeliveryRequest> Benchmark::generateRandomRequests(int numRequests) {
    std::vector<DeliveryRequest> requests;
    requests.reserve(numRequests);

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> weightDist(1.0, 50.0);
    std::uniform_int_distribution<> deadlineDist(1, 100);
    std::uniform_int_distribution<> priorityDist(1, 5);
    std::uniform_real_distribution<> distanceDist(1.0, 100.0);

    for (int i = 0; i < numRequests; ++i) {
        requests.emplace_back(
            "REQ" + std::to_string(i),
            weightDist(gen),
            deadlineDist(gen),
            priorityDist(gen),
            distanceDist(gen),
            i // Timestamp is sequential
        );
    }
    return requests;
}

void Benchmark::runPerformanceTests() {
    std::vector<int> sizes = {1000, 5000, 10000, 20000};
    std::cout << "========================================\n";
    std::cout << "   PERFORMANCE BENCHMARK (Runtime in ms)\n";
    std::cout << "========================================\n";
    std::cout << std::left << std::setw(10) << "Size" 
              << std::setw(15) << "Merge Sort" 
              << std::setw(15) << "Quick Sort" 
              << std::setw(15) << "Heap Sort"
              << std::setw(15) << "Bubble Sort" << "\n";
    std::cout << "--------------------------------------------------------------\n";

    for (int size : sizes) {
        auto dataset = generateRandomRequests(size);

        // Merge Sort Bench
        auto dataMerge = dataset;
        auto start = std::chrono::high_resolution_clock::now();
        SortingEngine::mergeSort(dataMerge, 0, dataMerge.size() - 1);
        auto end = std::chrono::high_resolution_clock::now();
        double timeMerge = std::chrono::duration<double, std::milli>(end - start).count();

        // Quick Sort Bench
        auto dataQuick = dataset;
        start = std::chrono::high_resolution_clock::now();
        SortingEngine::quickSort(dataQuick, 0, dataQuick.size() - 1);
        end = std::chrono::high_resolution_clock::now();
        double timeQuick = std::chrono::duration<double, std::milli>(end - start).count();

        // Heap Sort Bench
        auto dataHeap = dataset;
        start = std::chrono::high_resolution_clock::now();
        SortingEngine::heapSort(dataHeap);
        end = std::chrono::high_resolution_clock::now();
        double timeHeap = std::chrono::duration<double, std::milli>(end - start).count();

        // Bubble Sort Bench
        auto dataBubble = dataset;
        start = std::chrono::high_resolution_clock::now();
        SortingEngine::bubbleSort(dataBubble);
        end = std::chrono::high_resolution_clock::now();
        double timeBubble = std::chrono::duration<double, std::milli>(end - start).count();

        std::cout << std::left << std::setw(10) << size 
                  << std::setw(15) << timeMerge 
                  << std::setw(15) << timeQuick 
                  << std::setw(15) << timeHeap 
                  << std::setw(15) << timeBubble << "\n";
    }
    std::cout << "========================================\n\n";
}

void Benchmark::runStabilityDemonstration() {
    std::cout << "========================================\n";
    std::cout << "         STABILITY DEMONSTRATION         \n";
    std::cout << "========================================\n";
    
    // Create a dataset with identical deadlines
    std::vector<DeliveryRequest> dataset = {
        {"A", 10.0, 5, 1, 15.0, 1},
        {"B", 10.0, 5, 1, 15.0, 2},
        {"C", 10.0, 5, 1, 15.0, 3},
        {"D", 10.0, 5, 1, 15.0, 4},
        {"E", 10.0, 5, 1, 15.0, 5}
    };

    std::cout << "Initial requests (Timestamp order = Arrival Order):\n";
    for (const auto& req : dataset) {
        std::cout << "  " << req << "\n";
    }

    // Merge Sort (Stable) Test
    auto mergeData = dataset;
    // Mess up the initial order slightly while keeping deadlines equal, to show stable sort handles actual sorting smoothly
    // Wait, if we sort an already sorted list with a stable sort, the order must remain EXACTLY the same.
    // Let's create a dataset where we sort by priority first, then by deadline.
    // Or let's just reverse the timestamps slightly but keep deadlines same.
    dataset = {
        {"A", 10.0, 5, 1, 15.0, 1},
        {"B", 10.0, 5, 1, 15.0, 2},
        {"C", 10.0, 5, 1, 15.0, 3},
        {"D", 10.0, 2, 1, 15.0, 4}, // smaller deadline
        {"E", 10.0, 5, 1, 15.0, 5}
    };
    
    std::cout << "\nNew Initial Dataset with one earlier deadline:\n";
    for (const auto& req : dataset) {
        std::cout << "  " << req << "\n";
    }

    mergeData = dataset;
    SortingEngine::mergeSort(mergeData, 0, mergeData.size() - 1);
    std::cout << "\nAfter Merge Sort (Stable, by Deadline):\n";
    for (const auto& req : mergeData) {
        std::cout << "  " << req << "\n";
    }
    
    // Quick Sort (Unstable) Test - sort by deadline using quick sort.
    auto quickData = dataset;
    SortingEngine::quickSortByDeadline(quickData, 0, quickData.size() - 1);
    std::cout << "\nAfter Quick Sort (Unstable, by Deadline):\n";
    for (const auto& req : quickData) {
        std::cout << "  " << req << "\n";
    }

    std::cout << "\nConclusion on Stability:\n";
    std::cout << "Notice that Merge Sort maintained the relative arrival order (Timestamp) for items A, B, C, and E,\n";
    std::cout << "because it is a stable sort. Quick Sort likely shuffled their relative order,\n";
    std::cout << "demonstrating that an unstable sort can negatively impact 'Delivery Fairness' for requests with identical priority constraints.\n";
    std::cout << "========================================\n\n";
}
