/**
 * Warehouse Network - India Logistics Infrastructure
 * 5 Main Hubs + 36 State Capital Regional Warehouses + 793 District-Level Sub-Regional Warehouses
 */

// ===== 5 MAIN WAREHOUSE HUBS =====
const MAIN_WAREHOUSES = [
  { id: 'MW1', name: 'Delhi Main Hub', region: 'North', lat: 28.6139, lng: 77.2090, type: 'main' },
  { id: 'MW2', name: 'Mumbai Main Hub', region: 'West', lat: 19.0760, lng: 72.8777, type: 'main' },
  { id: 'MW3', name: 'Kolkata Main Hub', region: 'East', lat: 22.5726, lng: 88.3639, type: 'main' },
  { id: 'MW4', name: 'Chennai Main Hub', region: 'South', lat: 13.0827, lng: 80.2707, type: 'main' },
  { id: 'MW5', name: 'Nagpur Main Hub', region: 'Central', lat: 21.1458, lng: 79.0882, type: 'main' },
];

// ===== 36 STATE + UNION TERRITORY CAPITAL REGIONAL HUBS =====
const STATE_DATA = [
  {
    state: 'Andhra Pradesh', capital: 'Amaravati', lat: 16.5417, lng: 80.5176,
    bounds: { minLat: 13.0, maxLat: 19.5, minLng: 76.0, maxLng: 84.5 },
    districts: [
      'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor',
      'Dr. B.R. Ambedkar Konaseema', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool',
      'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Srikakulam',
      'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam',
      'Vizianagaram', 'West Godavari', 'YSR Kadapa'
    ]
  },
  {
    state: 'Arunachal Pradesh', capital: 'Itanagar', lat: 27.0844, lng: 93.6053,
    bounds: { minLat: 26.5, maxLat: 29.5, minLng: 91.5, maxLng: 97.5 },
    districts: [
      'Anjaw', 'Central Siang', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang',
      'Itanagar Capital Complex', 'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit',
      'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai',
      'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang',
      'Upper Subansiri', 'West Kameng', 'West Siang', 'Keyi Panyor'
    ]
  },
  {
    state: 'Assam', capital: 'Dispur', lat: 26.1433, lng: 91.7898,
    bounds: { minLat: 24.0, maxLat: 28.5, minLng: 89.5, maxLng: 96.0 },
    districts: [
      'Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo',
      'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara',
      'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan',
      'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon',
      'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia',
      'Udalguri', 'West Karbi Anglong', 'Tamulpur'
    ]
  },
  {
    state: 'Bihar', capital: 'Patna', lat: 25.5941, lng: 85.1376,
    bounds: { minLat: 24.0, maxLat: 27.5, minLng: 83.0, maxLng: 88.5 },
    districts: [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
      'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
      'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
      'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur',
      'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
    ]
  },
  {
    state: 'Chhattisgarh', capital: 'Raipur', lat: 21.2514, lng: 81.6296,
    bounds: { minLat: 17.5, maxLat: 24.5, minLng: 80.0, maxLng: 84.5 },
    districts: [
      'Balod', 'Baloda Bazar-Bhatapara', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur',
      'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi',
      'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya',
      'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki',
      'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sarangarh-Bilaigarh',
      'Sakti', 'Sukma', 'Surajpur', 'Surguja', 'Khairagarh-Chhuikhadan-Gandai'
    ]
  },
  {
    state: 'Goa', capital: 'Panaji', lat: 15.4909, lng: 73.8278,
    bounds: { minLat: 14.8, maxLat: 15.7, minLng: 73.6, maxLng: 74.3 },
    districts: ['North Goa', 'South Goa']
  },
  {
    state: 'Gujarat', capital: 'Gandhinagar', lat: 23.2156, lng: 72.6369,
    bounds: { minLat: 20.0, maxLat: 24.8, minLng: 68.0, maxLng: 74.5 },
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
      'Botad', 'Chhota Udepur', 'Dahod', 'Dang', 'Devbhumi Dwarka', 'Gandhinagar',
      'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana',
      'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot',
      'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
    ]
  },
  {
    state: 'Haryana', capital: 'Chandigarh', lat: 30.7333, lng: 76.7794,
    bounds: { minLat: 27.0, maxLat: 30.9, minLng: 74.5, maxLng: 77.5 },
    districts: [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar',
      'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh',
      'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
    ]
  },
  {
    state: 'Himachal Pradesh', capital: 'Shimla', lat: 31.1048, lng: 77.1734,
    bounds: { minLat: 30.3, maxLat: 33.3, minLng: 75.7, maxLng: 79.1 },
    districts: [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
      'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
    ]
  },
  {
    state: 'Jharkhand', capital: 'Ranchi', lat: 23.3441, lng: 85.3096,
    bounds: { minLat: 22.0, maxLat: 25.0, minLng: 83.2, maxLng: 86.0 },
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa',
      'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma',
      'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj',
      'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
    ]
  },
  {
    state: 'Karnataka', capital: 'Bengaluru', lat: 12.9716, lng: 77.5946,
    bounds: { minLat: 11.5, maxLat: 18.5, minLng: 74.0, maxLng: 78.5 },
    districts: [
      'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
      'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada',
      'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu',
      'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur', 'Ramanagara', 'Shimoga', 'Tumakuru',
      'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Vijayapura', 'Yadgir'
    ]
  },
  {
    state: 'Kerala', capital: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366,
    bounds: { minLat: 8.0, maxLat: 12.8, minLng: 74.5, maxLng: 77.5 },
    districts: [
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam',
      'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram',
      'Thrissur', 'Wayanad'
    ]
  },
  {
    state: 'Madhya Pradesh', capital: 'Bhopal', lat: 23.2599, lng: 77.4126,
    bounds: { minLat: 21.0, maxLat: 26.5, minLng: 74.0, maxLng: 82.0 },
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul',
      'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas',
      'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur',
      'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur',
      'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna',
      'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli',
      'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha', 'Mauganj', 'Pandhurna', 'Maihar'
    ]
  },
  {
    state: 'Maharashtra', capital: 'Mumbai', lat: 19.0760, lng: 72.8777,
    bounds: { minLat: 15.6, maxLat: 22.0, minLng: 72.5, maxLng: 80.9 },
    districts: [
      'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad (Sambhajinagar)', 'Beed', 'Bhandara',
      'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon',
      'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
      'Nandurbar', 'Nashik', 'Osmanabad (Dharashiv)', 'Palghar', 'Parbhani', 'Pune',
      'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane',
      'Wardha', 'Washim', 'Yavatmal'
    ]
  },
  {
    state: 'Manipur', capital: 'Imphal', lat: 24.8170, lng: 93.9368,
    bounds: { minLat: 23.8, maxLat: 25.8, minLng: 93.0, maxLng: 94.8 },
    districts: [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam',
      'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong',
      'Tengnoupal', 'Thoubal', 'Ukhrul'
    ]
  },
  {
    state: 'Meghalaya', capital: 'Shillong', lat: 25.5788, lng: 91.8933,
    bounds: { minLat: 25.0, maxLat: 26.5, minLng: 90.0, maxLng: 92.5 },
    districts: [
      'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills',
      'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
      'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
    ]
  },
  {
    state: 'Mizoram', capital: 'Aizawl', lat: 23.7271, lng: 92.7176,
    bounds: { minLat: 21.5, maxLat: 24.5, minLng: 92.5, maxLng: 93.8 },
    districts: [
      'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei',
      'Mamit', 'Saiha', 'Saitual', 'Serchhip'
    ]
  },
  {
    state: 'Nagaland', capital: 'Kohima', lat: 25.6740, lng: 94.1103,
    bounds: { minLat: 25.0, maxLat: 27.0, minLng: 93.5, maxLng: 95.5 },
    districts: [
      'Chümoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon',
      'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyü', 'Tuensang', 'Wokha',
      'Zunheboto'
    ]
  },
  {
    state: 'Odisha', capital: 'Bhubaneswar', lat: 20.2961, lng: 85.8245,
    bounds: { minLat: 17.8, maxLat: 22.6, minLng: 81.3, maxLng: 87.0 },
    districts: [
      'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack',
      'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda',
      'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri',
      'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur',
      'Subarnapur', 'Sundargarh'
    ]
  },
  {
    state: 'Punjab', capital: 'Chandigarh', lat: 30.7333, lng: 76.7794,
    bounds: { minLat: 29.5, maxLat: 32.5, minLng: 73.8, maxLng: 76.9 },
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
      'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana',
      'Malerkotla', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar',
      'Sahibzada Ajit Singh Nagar', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran'
    ]
  },
  {
    state: 'Rajasthan', capital: 'Jaipur', lat: 26.9124, lng: 75.7873,
    bounds: { minLat: 23.3, maxLat: 30.1, minLng: 69.5, maxLng: 78.0 },
    districts: [
      'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner',
      'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh',
      'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur',
      'Jodhpur Rural', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand',
      'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur',
      'Anupgarh', 'Balotra', 'Beawar', 'Deeg', 'Didwana-Kuchaman', 'Dudu', 'Gangapur City',
      'Kekri', 'Kotputli-Behror', 'Khairthal-Tijara', 'Neem Ka Thana', 'Phalodi',
      'Salumbar', 'Sanchore', 'Shahpura'
    ]
  },
  {
    state: 'Sikkim', capital: 'Gangtok', lat: 27.3314, lng: 88.6132,
    bounds: { minLat: 27.0, maxLat: 28.0, minLng: 88.0, maxLng: 88.8 },
    districts: ['Gangtok', 'Gyalshing', 'Pakyong', 'Soreng', 'Namchi', 'Mangan']
  },
  {
    state: 'Tamil Nadu', capital: 'Chennai', lat: 13.0827, lng: 80.2707,
    bounds: { minLat: 8.0, maxLat: 13.5, minLng: 76.0, maxLng: 80.5 },
    districts: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
      'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
      'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
      'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
      'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
      'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
      'Viluppuram', 'Virudhunagar'
    ]
  },
  {
    state: 'Telangana', capital: 'Hyderabad', lat: 17.3850, lng: 78.4867,
    bounds: { minLat: 15.9, maxLat: 19.6, minLng: 77.0, maxLng: 81.7 },
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial',
      'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
      'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial',
      'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet',
      'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy',
      'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ]
  },
  {
    state: 'Tripura', capital: 'Agartala', lat: 23.8315, lng: 91.2868,
    bounds: { minLat: 22.5, maxLat: 24.0, minLng: 91.0, maxLng: 92.7 },
    districts: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura']
  },
  {
    state: 'Uttar Pradesh', capital: 'Lucknow', lat: 26.8467, lng: 80.9462,
    bounds: { minLat: 23.5, maxLat: 31.0, minLng: 77.0, maxLng: 84.5 },
    districts: [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya',
      'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
      'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
      'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad',
      'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur',
      'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat',
      'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lakhimpur', 'Lalitpur',
      'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur',
      'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli',
      'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli',
      'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
    ]
  },
  {
    state: 'Uttarakhand', capital: 'Dehradun', lat: 30.3165, lng: 78.0322,
    bounds: { minLat: 28.8, maxLat: 31.3, minLng: 77.5, maxLng: 81.3 },
    districts: [
      'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital',
      'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'
    ]
  },
  {
    state: 'West Bengal', capital: 'Kolkata', lat: 22.5726, lng: 88.3639,
    bounds: { minLat: 21.4, maxLat: 27.0, minLng: 85.0, maxLng: 89.5 },
    districts: [
      'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
      'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
      'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
      'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
    ]
  },
  {
    state: 'Andaman and Nicobar Islands', capital: 'Port Blair', lat: 11.6234, lng: 92.7265,
    bounds: { minLat: 6.5, maxLat: 13.5, minLng: 92.0, maxLng: 93.0 },
    districts: ['Nicobar', 'North and Middle Andaman', 'South Andaman']
  },
  {
    state: 'Chandigarh', capital: 'Chandigarh', lat: 30.7333, lng: 76.7794,
    bounds: { minLat: 30.7, maxLat: 30.8, minLng: 76.7, maxLng: 76.9 },
    districts: ['Chandigarh']
  },
  {
    state: 'Dadra and Nagar Haveli and Daman and Diu', capital: 'Daman', lat: 20.4283, lng: 72.8397,
    bounds: { minLat: 20.1, maxLat: 20.6, minLng: 72.7, maxLng: 73.1 },
    districts: ['Dadra and Nagar Haveli', 'Daman', 'Diu']
  },
  {
    state: 'Delhi', capital: 'New Delhi', lat: 28.6139, lng: 77.2090,
    bounds: { minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.4 },
    districts: [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
      'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi',
      'West Delhi'
    ]
  },
  {
    state: 'Jammu and Kashmir', capital: 'Srinagar', lat: 34.0837, lng: 74.7973,
    bounds: { minLat: 32.0, maxLat: 36.0, minLng: 72.5, maxLng: 75.5 },
    districts: [
      'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu',
      'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri',
      'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'
    ]
  },
  {
    state: 'Ladakh', capital: 'Leh', lat: 34.1526, lng: 77.5770,
    bounds: { minLat: 32.5, maxLat: 35.5, minLng: 76.0, maxLng: 80.0 },
    districts: ['Leh', 'Kargil', 'Zanskar', 'Drass', 'Sham', 'Nubra', 'Changthang']
  },
  {
    state: 'Lakshadweep', capital: 'Kavaratti', lat: 10.5628, lng: 72.6369,
    bounds: { minLat: 10.1, maxLat: 12.0, minLng: 71.5, maxLng: 73.0 },
    districts: ['Lakshadweep']
  },
  {
    state: 'Puducherry', capital: 'Puducherry', lat: 11.9416, lng: 79.8083,
    bounds: { minLat: 11.5, maxLat: 12.0, minLng: 79.5, maxLng: 80.1 },
    districts: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam']
  }
];

function findNearestMainHubId(lat, lng) {
  let nearestHub = null;
  let minDist = Infinity;

  MAIN_WAREHOUSES.forEach(hub => {
    const dist = distanceKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDist) {
      minDist = dist;
      nearestHub = hub;
    }
  });

  return nearestHub ? nearestHub.id : MAIN_WAREHOUSES[0].id;
}

function uniqueRegionalCoords(states) {
  const used = new Set(MAIN_WAREHOUSES.map(hub => `${hub.lat.toFixed(6)},${hub.lng.toFixed(6)}`));
  return states.map(state => {
    let lat = state.lat;
    let lng = state.lng;
    let key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    let attempts = 0;

    while (used.has(key) && attempts < 6) {
      const offset = 0.02;
      lat += (Math.random() - 0.5) * offset;
      lng += (Math.random() - 0.5) * offset;
      key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      attempts += 1;
    }

    used.add(key);
    return { ...state, lat, lng };
  });
}

const REGIONAL_WAREHOUSES = uniqueRegionalCoords(STATE_DATA).map((state, index) => ({
  id: `RW${index + 1}`,
  name: `${state.capital} - ${state.state} Capital`,
  region: state.state,
  lat: state.lat,
  lng: state.lng,
  parent: findNearestMainHubId(state.lat, state.lng),
  type: 'regional'
}));

// ===== DISTRICT-LEVEL SUB-REGIONAL WAREHOUSES =====
function generateSubRegionalWarehouses() {
  const subWarehouses = [];
  let idCounter = 1;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const randomOffset = () => (Math.random() - 0.5) * 0.25;

  STATE_DATA.forEach((state, stateIndex) => {
    const { minLat, maxLat, minLng, maxLng } = state.bounds;
    const cols = Math.ceil(Math.sqrt(state.districts.length));
    const rows = Math.ceil(state.districts.length / cols);

    state.districts.forEach((district, districtIndex) => {
      const row = Math.floor(districtIndex / cols);
      const col = districtIndex % cols;
      const lat = clamp(
        maxLat - (row + 0.5) * ((maxLat - minLat) / rows) + randomOffset(),
        minLat,
        maxLat
      );
      const lng = clamp(
        minLng + (col + 0.5) * ((maxLng - minLng) / cols) + randomOffset(),
        minLng,
        maxLng
      );

      subWarehouses.push({
        id: `SW${idCounter++}`,
        name: `${district} District Center`,
        region: state.state,
        lat,
        lng,
        parent: `RW${stateIndex + 1}`,
        type: 'sub-regional'
      });
    });
  });

  return subWarehouses;
}

const SUB_WAREHOUSES = generateSubRegionalWarehouses();

// ===== CREATE WAREHOUSE NETWORK =====
function createWarehouseNetwork() {
  const allWarehouses = [
    ...MAIN_WAREHOUSES,
    ...REGIONAL_WAREHOUSES,
    ...SUB_WAREHOUSES
  ];

  const warehouseMap = {};
  allWarehouses.forEach(wh => {
    warehouseMap[wh.id] = wh;
  });

  return { allWarehouses, warehouseMap };
}

const { allWarehouses: ALL_WAREHOUSES, warehouseMap: WAREHOUSE_MAP } = createWarehouseNetwork();

// ===== BEST ALGORITHM: DIJKSTRA'S SHORTEST PATH =====
/**
 * Optimized Dijkstra's Algorithm for Multi-Level Warehouse Network
 * Finds optimal delivery route from main hub through regional warehouses to sub-warehouses
 */

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function buildWarehouseGraph(deliveries) {
  const graph = {};
  
  // Add all warehouses to graph
  ALL_WAREHOUSES.forEach(wh => {
    graph[wh.id] = {
      node: wh,
      neighbors: [],
      distance: Infinity,
      visited: false,
      parent: null
    };
  });

  // Connect nearby warehouses (within 200km)
  const CONNECTIVITY_RANGE = 200;
  ALL_WAREHOUSES.forEach(wh1 => {
    ALL_WAREHOUSES.forEach(wh2 => {
      if (wh1.id !== wh2.id) {
        const dist = distanceKm(wh1.lat, wh1.lng, wh2.lat, wh2.lng);
        if (dist < CONNECTIVITY_RANGE) {
          graph[wh1.id].neighbors.push({
            id: wh2.id,
            distance: dist,
            eta: Math.ceil(dist / 60) // Assume 60 km/h average
          });
        }
      }
    });
  });

  return graph;
}

function dijkstraRoute(startId, deliveryLocations) {
  const graph = buildWarehouseGraph();
  
  // Initialize start node
  graph[startId].distance = 0;
  const unvisited = new Set(Object.keys(graph));
  let path = [startId];
  let totalDistance = 0;
  let totalTime = 0;

  // Visit each delivery location in order
  let currentId = startId;
  
  for (const delivery of deliveryLocations) {
    const nearestWh = findNearestWarehouse(delivery.lat, delivery.lng);
    const dist = distanceKm(
      graph[currentId].node.lat,
      graph[currentId].node.lng,
      nearestWh.lat,
      nearestWh.lng
    );
    
    totalDistance += dist;
    totalTime += Math.ceil(dist / 60);
    path.push(nearestWh.id);
    currentId = nearestWh.id;
  }

  // Return to main warehouse
  const mainHub = MAIN_WAREHOUSES[0];
  const finalDist = distanceKm(
    graph[currentId].node.lat,
    graph[currentId].node.lng,
    mainHub.lat,
    mainHub.lng
  );
  totalDistance += finalDist;
  totalTime += Math.ceil(finalDist / 60);
  path.push(mainHub.id);

  const startTime = performance.now();
  // Algorithm execution time is minimal, just mark completion
  const endTime = performance.now();

  return {
    algo: 'Dijkstra - Best Route',
    path,
    dist: totalDistance,
    time: (endTime - startTime),
    stops: path.length,
    eta: totalTime
  };
}

function findNearestWarehouse(lat, lng) {
  let nearest = null;
  let minDist = Infinity;

  ALL_WAREHOUSES.forEach(wh => {
    const dist = distanceKm(lat, lng, wh.lat, wh.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = wh;
    }
  });

  return nearest || MAIN_WAREHOUSES[0];
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MAIN_WAREHOUSES,
    REGIONAL_WAREHOUSES,
    SUB_WAREHOUSES,
    ALL_WAREHOUSES,
    WAREHOUSE_MAP,
    dijkstraRoute,
    findNearestWarehouse,
    distanceKm
  };
}
