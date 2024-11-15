const tasks = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description, startDate, endDate, status, progress } = req.body;

  try {
    const task = new tasks({
      title,
      description,
      startDate,
      endDate,
      status,
      progress,
      user: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await tasks.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, startDate, endDate, status, progress } = req.body;
  const taskId = req.params.id;

  try {
    const task = await tasks.findByIdAndUpdate(
      taskId,
      { title, description, startDate, endDate, status, progress },
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await tasks.findByIdAndDelete(taskId);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
