#ifndef DELIVERY_REQUEST_H
#define DELIVERY_REQUEST_H

#include <string>
#include <iostream>

struct DeliveryRequest {
    std::string id;
    double weight;
    int deadline;   // Smaller is earlier
    int priority;   // Smaller is higher priority (or vice versa? let's define smaller as more critical, or higher as more critical? Let's say higher = more critical)
    double distance;
    int timestamp;  // Used for stability testing (simulates arrival order)

    DeliveryRequest(std::string id, double weight, int deadline, int priority, double distance, int timestamp);

    // Friend function to easily print
    friend std::ostream& operator<<(std::ostream& os, const DeliveryRequest& req);
};

// Comparators for sorting
struct CompareByDeadline {
    bool operator()(const DeliveryRequest& a, const DeliveryRequest& b) const {
        return a.deadline < b.deadline; // Earlier deadline first
    }
};

struct CompareByPriority {
    bool operator()(const DeliveryRequest& a, const DeliveryRequest& b) const {
        return a.priority > b.priority; // Higher priority first
    }
};

#endif // DELIVERY_REQUEST_H
