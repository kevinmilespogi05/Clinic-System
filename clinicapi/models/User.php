<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $username;
    public $password;
    public $contact_number;
    public $date_of_birth;
    public $medical_history;

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
        $query = "INSERT INTO " . $this->table_name . " (name, username, password, contact_number, date_of_birth, medical_history)
                  VALUES(:name, :username, :password, :contact_number, :date_of_birth, :medical_history)";

        // Prepare the statement
        $stmt = $this->conn->prepare($query);

        // Clean the input data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->contact_number = htmlspecialchars(strip_tags($this->contact_number));
        $this->date_of_birth = htmlspecialchars(strip_tags($this->date_of_birth));
        $this->medical_history = htmlspecialchars(strip_tags($this->medical_history));

        // Bind the parameters
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':contact_number', $this->contact_number);
        $stmt->bindParam(':date_of_birth', $this->date_of_birth);
        $stmt->bindParam(':medical_history', $this->medical_history);

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
        $query = "SELECT id, username, password, name, contact_number, date_of_birth FROM " . $this->table_name . " WHERE username = :username LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verify password
            if (password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->name = $row['name'];
                $this->contact_number = $row['contact_number'];
                $this->date_of_birth = $row['date_of_birth'];

                return true;
            }
        }

        return false;
    }
}
?>
