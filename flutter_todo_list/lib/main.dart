import 'dart:convert';

import 'package:flutter/material.dart';
import 'dart:io';

import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Todo List',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Todo List'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late Future<List<String>> todoResults;

  Future<List<String>> getTodos() async {
    String tursoDbUrl =
        const String.fromEnvironment("TURSO_URL", defaultValue: "");
    String tursoAuthToken =
        const String.fromEnvironment("TURSO_AUTH_TOKEN", defaultValue: "");
    try {
      final response = await http.post(Uri.parse(tursoDbUrl),
          headers: {
            HttpHeaders.authorizationHeader: "Bearer $tursoAuthToken",
            HttpHeaders.acceptHeader: "application/json"
          },
          body: json.encode({
            "statements": ["select * from todos"]
          }));

      var todoList = List<String>.from(jsonDecode(response.body)[0]["results"]
              ["rows"]
          .map((dynamic item) => item[0]));
      return todoList;
    } on Error catch (e) {
      // ignore: avoid_print
      print(e);
      return <String>[];
    }
  }

  void startFetching() {
    setState(() {
      todoResults = getTodos();
    });
  }

  @override
  void initState() {
    super.initState();
    startFetching();
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // TRY THIS: Try changing the color here to a specific color (to
        // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
        // change color while the other colors stay the same.
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: FutureBuilder(
          future: todoResults,
          builder: (context, snapshot) {
            switch (snapshot.connectionState) {
              case ConnectionState.none:
                return const Column(
                  children: [
                    Expanded(
                      child: Text("No connection"),
                    )
                  ],
                );
              case ConnectionState.waiting:
                return const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Center(
                      child: CircularProgressIndicator(),
                    )
                  ],
                );
              case ConnectionState.active:
                return const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Center(
                      child: CircularProgressIndicator(),
                    )
                  ],
                );
              case ConnectionState.done:
                if (snapshot.hasError) {
                  return const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Center(
                        child: Text("Failed to fetch data"),
                      )
                    ],
                  );
                }
                if (snapshot.hasData) {
                  return ListView.builder(
                      padding: const EdgeInsets.all(20.0),
                      itemCount: snapshot.data?.length,
                      itemBuilder: (BuildContext context, int index) {
                        String? todo = snapshot.data?[index];
                        return SizedBox(
                          height: 50,
                          child: Center(child: Text("$todo")),
                        );
                      });
                }
                return const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Text("We are both lost"),
                    )
                  ],
                );
            }
          }),
    );
  }
}
