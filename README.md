
Prototype for a simple dashboard for displaying commit and change data from GitLab and personal evaluation.

To use:
- Open gitlab/dataload.js and change this variables to your user:
	const user = "doctormo";
- Open gitlab/dataload.html. Wait for script execution. Save result file as "dataset.js" in root directory.
- Open index.html and see your data displayed.

Next steps:
- Add a way to filter Git data.
- Structure dataset and server side data collection.
- Add pages to show lines changed, added and deleted (if possible).
- Add statistics and insights page.
- On 'By hour' graph, add weekday filter.
- On 'By day of month' graph, add month filter.
