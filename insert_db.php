<?php
    require_once "./vendor/autoload.php"; // richiesta al vendor

    $client = new GuzzleHttp\Client(); // richiesta a Guzzle client

# codice movie:
    $res = $client->request('GET', 'https://api.themoviedb.org/3/discover/movie?api_key=615792ad94b3cc4c4bd1598289bca684'); // API.movie

    # output run 
    echo $res->getStatusCode(); // "200"
    echo $res->getHeader('content-type')[0]; // 'application/json; charset=utf8'

    $response = json_decode($res->getBody(), true); // ricevimento risposta da API.movie

    # variabili connessione DB
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";

    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB

    # foreach inserimento dati da API.movie a DB
    foreach($response["results"] as $film) 
    {
        # escaping variabili DB.film
        $film["id"] = mysqli_real_escape_string($sql, $film["id"]);
        $film["backdrop_path"] = mysqli_real_escape_string($sql, $film["backdrop_path"]);
        $film["title"] = mysqli_real_escape_string($sql, $film["title"]);
        $film["overview"] = mysqli_escape_string($sql, $film["overview"]);
        $film["release_date"] = mysqli_real_escape_string($sql, $film["release_date"]);
        $film["vote_average"] = mysqli_real_escape_string($sql, $film["vote_average"]);
        
        # INSERT TO & SELECT FROM (DB.film)
        $sql->query("INSERT INTO film (id, backdrop_path, title, overview, release_date, vote_average) VALUES ('{$film["id"]}', '{$film["backdrop_path"]}', '{$film["title"]}', '{$film["overview"]}', '{$film["release_date"]}', '{$film["vote_average"]}')");
        $results = $sql->query("SELECT * FROM film");
    }

# codice tv:
    $rest = $client->request('GET', 'https://api.themoviedb.org/3/discover/tv?api_key=615792ad94b3cc4c4bd1598289bca684'); // API.tv

    $response = json_decode($rest->getBody(), true); // ricevimento risposta da API.tv

    # foreach inserimento dati da API.tv a DB
    foreach($response["results"] as $serietv)
    {
        # escaping variabili DB.serietv
        $serietv["id"] = mysqli_real_escape_string($sql, $serietv["id"]);
        $serietv["backdrop_path"] = mysqli_real_escape_string($sql, $serietv["backdrop_path"]);
        $serietv["name"] = mysqli_real_escape_string($sql, $serietv["name"]);
        $serietv["overview"] = mysqli_escape_string($sql, $serietv["overview"]);
        $serietv["first_air_date"] = mysqli_real_escape_string($sql, $serietv["first_air_date"]);
        $serietv["vote_average"] = mysqli_real_escape_string($sql, $serietv["vote_average"]);

        # INSERT TO & SELECT FROM (DB.serietv)
        $sql->query("INSERT INTO serietv (id, backdrop_path, name, overview, first_air_date, vote_average) VALUES ('{$serietv["id"]}', '{$serietv["backdrop_path"]}', '{$serietv["name"]}', '{$serietv["overview"]}', '{$serietv["first_air_date"]}', '{$serietv["vote_average"]}')");
        $results = $sql->query("SELECT * FROM serietv");
    }