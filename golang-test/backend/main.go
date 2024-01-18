package main

import (
    "io/ioutil"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/connections", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Authorization")

        if r.Method == "OPTIONS" {
            return
        }

        // The authentication token should be passed as a query parameter
        authToken := r.URL.Query().Get("token")
        if authToken == "" {
            http.Error(w, "No auth token provided", http.StatusBadRequest)
            return
        }

        guacamoleURL := "http://localhost:8080/guacamole/api/session/data/postgresql/connections?token=" + authToken

        client := &http.Client{}
        req, err := http.NewRequest("GET", guacamoleURL, nil)
        if err != nil {
            log.Println("Error creating request to Guacamole server:", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        resp, err := client.Do(req)
        if err != nil {
            log.Println("Error on request to Guacamole server:", err)
            http.Error(w, err.Error(), http.StatusBadGateway)
            return
        }
        defer resp.Body.Close()

        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            log.Println("Error reading response body:", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        log.Printf("Guacamole server response: %s\n", body)

        if resp.StatusCode != http.StatusOK {
            http.Error(w, "Guacamole server error", resp.StatusCode)
            return
        }

        w.Write(body)
    })

    log.Println("Server is running on port 8081")
    log.Fatal(http.ListenAndServe(":8081", nil))
}
