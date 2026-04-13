#ifndef BENCHMARK_H
#define BENCHMARK_H

#include "DeliveryRequest.h"
#include <vector>

class Benchmark {
public:
    static std::vector<DeliveryRequest> generateRandomRequests(int numRequests);
    
    // Runs and prints the performance of various sorting algorithms
    static void runPerformanceTests();

    // Runs a small stability test to demonstrate the impact of unstable sorting
    static void runStabilityDemonstration();
};

#endif // BENCHMARK_H
