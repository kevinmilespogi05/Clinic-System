<?php
class User {
    private $conn;
    private $table_name = "users";

    // User properties
    public $id;
    public $first_name;
    public $last_name;
    public $username;
    public $password;
    public $contact_number;
    public $date_of_birth;
    public $medical_history;

    // Billing information
    public $card_first_name;
    public $card_last_name;
    public $card_number;
    public $card_expiry;
    public $card_security_code;
    public $billing_address;
    public $city;                 // Renamed from billing_city
    public $province;             // Renamed from billing_state
    public $billing_postal_code;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Register a new user
    public function register() {
        // Check if the username already exists
        if ($this->usernameExists()) {
            return false;
        }

        // Insert query
        $query = "INSERT INTO " . $this->table_name . " 
            (first_name, last_name, username, password, contact_number, date_of_birth, medical_history, 
             card_first_name, card_last_name, card_number, card_expiry, card_security_code, 
             billing_address, city, province, billing_postal_code)
            VALUES 
            (:first_name, :last_name, :username, :password, :contact_number, :date_of_birth, :medical_history, 
             :card_first_name, :card_last_name, :card_number, :card_expiry, :card_security_code, 
             :billing_address, :city, :province, :billing_postal_code)";

        // Prepare the statement
        $stmt = $this->conn->prepare($query);

        // Clean the input data
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->contact_number = htmlspecialchars(strip_tags($this->contact_number));
        $this->date_of_birth = htmlspecialchars(strip_tags($this->date_of_birth));
        $this->medical_history = htmlspecialchars(strip_tags($this->medical_history));
        $this->card_first_name = htmlspecialchars(strip_tags($this->card_first_name));
        $this->card_last_name = htmlspecialchars(strip_tags($this->card_last_name));
        $this->card_number = htmlspecialchars(strip_tags($this->card_number));
        $this->card_expiry = htmlspecialchars(strip_tags($this->card_expiry));
        $this->card_security_code = htmlspecialchars(strip_tags($this->card_security_code));
        $this->billing_address = htmlspecialchars(strip_tags($this->billing_address));
        $this->city = htmlspecialchars(strip_tags($this->city));                 // Updated field
        $this->province = htmlspecialchars(strip_tags($this->province));         // Updated field
        $this->billing_postal_code = htmlspecialchars(strip_tags($this->billing_postal_code));

        // Bind the parameters
        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':contact_number', $this->contact_number);
        $stmt->bindParam(':date_of_birth', $this->date_of_birth);
        $stmt->bindParam(':medical_history', $this->medical_history);
        $stmt->bindParam(':card_first_name', $this->card_first_name);
        $stmt->bindParam(':card_last_name', $this->card_last_name);
        $stmt->bindParam(':card_number', $this->card_number);
        $stmt->bindParam(':card_expiry', $this->card_expiry);
        $stmt->bindParam(':card_security_code', $this->card_security_code);
        $stmt->bindParam(':billing_address', $this->billing_address);
        $stmt->bindParam(':city', $this->city);                 // Updated field
        $stmt->bindParam(':province', $this->province);         // Updated field
        $stmt->bindParam(':billing_postal_code', $this->billing_postal_code);

        // Execute the query and check if successful
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Check if a username already exists
    public function usernameExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE username = :username LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }

        return false;
    }

    // User login
    public function login() {
        $query = "SELECT id, username, password, first_name, last_name, contact_number, date_of_birth 
                  FROM " . $this->table_name . " 
                  WHERE username = :username LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verify password
            if (password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->first_name = $row['first_name'];
                $this->last_name = $row['last_name'];
                $this->contact_number = $row['contact_number'];
                $this->date_of_birth = $row['date_of_birth'];

                return true;
            }
        }

        return false;
    }
}
?>
