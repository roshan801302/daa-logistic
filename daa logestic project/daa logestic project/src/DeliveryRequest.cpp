#include "DeliveryRequest.h"

DeliveryRequest::DeliveryRequest(std::string id, double weight, int deadline, int priority, double distance, int timestamp)
    : id(id), weight(weight), deadline(deadline), priority(priority), distance(distance), timestamp(timestamp) {}

std::ostream& operator<<(std::ostream& os, const DeliveryRequest& req) {
    os << "[ID: " << req.id 
       << " | Deadline: " << req.deadline 
       << " | Priority: " << req.priority 
       << " | Timestamp: " << req.timestamp << "]";
    return os;
}
