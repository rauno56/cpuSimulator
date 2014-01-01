CPU scheduling simulation
=========================

AngularJS app that simulates CPU scheduling

Install
======
Just download or clone the repo. Everything is included.

Run
===
Open the index.html file in the browser. As simple as that.

App
===

Theres 5 sections:

1. __Visualization__: The most upper green one is it. The brownish-red boxes represent the CPU time given to specific processes. Every box contains it's id(i), starting place(s) and duration(d).
2. __Settings__: Scale down the visualization if in need to fit the whole thing on screen and choose from different scheduling schemas.
3. __Manual__: For manually manipulating the so-called todo list. When ready, Try it out by pressing `Run`.
4. __Examples__: First there is few premade patterns and then a box for you to insert one. Patterns are semicolon-separated(`;`) list of comma-separated(`,`) pairs of starting time and duration of the request of CPU time.
5. __Mean waiting time__: The mean time a process was uselessly on halt waiting for it's CPU time. The time in which the CPU was busy calculating for the named process is not counted in here.

Input fields are submitted and actions are done using `Enter`.


Complex schema is a combination of 3 queues:

1. 8 ms timeslice
2. 16 ms timeslice
3. FCFS

The algoritm goes like this:

- New request is added added to the first queue,
- Each process gets one try to finish its job in 1. and 2. level,
- Failing to do so it gets pushed to the next queue,
- 3. list is taken on only if there's nothing to process on the first two.

