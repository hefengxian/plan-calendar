import React from 'react'
import dayjs from 'dayjs'
import './App.css'


const tasks = [
  {
    title: '买车',
    desc: '',
    icon: 'icon/car.svg',
    start: '2020-04-19',
    end: '2020-12-31',
  },
  {
    title: '买房',
    desc: '',
    icon: 'icon/house.svg',
    start: '2020-04-19',
    end: '2020-12-31',
  },
  {
    title: '生娃',
    desc: '',
    icon: 'icon/kid.svg',
    start: '2020-04-19',
    end: '2020-12-31',
  },
  {
    title: '出国',
    desc: '',
    icon: 'icon/baggage.svg',
    start: '2020-04-19',
    end: '2020-12-31',
  },
  {
    title: '提升收入',
    desc: '',
    icon: 'icon/money.svg',
    start: '2020-04-19',
    end: '2020-12-31',
  },
]

class GraphTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      col: props.col ? props.col : 40,
      ...props
    }
  }

  render() {
    let {title, year, days, col} = this.state
    let row = Math.ceil(days / col)
    let tableContent = []
    let counter = 0
    let dateFormat = 'YYYY-MM-DD'
    let today = dayjs()
    let startDate = dayjs(`${year}-01-01`, dateFormat)
    for (let i = 0; i < row; i++) {
      let tr = []
      for (let j = 0; j < col; j++) {
        if (days <= counter) {
          break
        }
        let curDate = startDate.add(counter, 'day')
        let className
        if (curDate.isSame(today, 'day')) {
          className = 'current-day'
        }
        if (curDate.isBefore(today, 'day')) {
          className = 'passed'
        }
        tr.push(
          <td
            className={className}
            title={curDate.format(dateFormat)}
            key={j}
          ></td>
        )
        counter++
      }
      tableContent.push(<tr key={i}>{tr}</tr>)
    }

    return (
      <div>
        <span>{title}</span>
        <table>
          <tbody>
          {tableContent}
          </tbody>
        </table>
      </div>
    )
  }

}


class TargetGraph extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      startDate: dayjs(props.start),
      endDate: dayjs(props.end),
    }
  }

  render() {
    let years = this.getYears()

    years = years.map(y => {
      return <GraphTable
        key={y.year}
        title={y.year}
        year={y.year}
        days={y.days}
      />
    })
    return (
      <>
        {years}
      </>
    )
  }

  getYears() {
    let {startDate, endDate} = this.state
    let years = []

    while(startDate.isBefore(endDate, 'year') || startDate.isSame(endDate, 'year')) {
      let year = parseInt(startDate.format('YYYY'))
      let days = year % 4 === 0 ? 366 : 365
      years.push({year, days})
      startDate = startDate.add(1, 'year')
    }

    return years
  }
}


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      curIndex: 0,
      tasks,
    }
  }

  render() {
    let {curIndex} = this.state
    let curTask = tasks[curIndex]

    return (
      <div className="app">
        <div className="task">
          <div className="task-header">
            <span>任务列表</span>
          </div>
          <div className="task-list">
            <p className="task-group">五年计划</p>
            {
              tasks.map((t, k) => {
                let cls = ['task-item']
                if (k === curIndex) {
                  cls.push('active')
                }
                return (
                  <div
                    onClick={() => this.onTaskItemClick(k)}
                    className={cls.join(' ')}
                    key={k}>
                    <img className="task-icon" src={t.icon} alt={t.title}/>
                    {t.title}
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="task-body">
          <div className="task-title">
            <img className="task-icon" src={curTask.icon} alt={curTask.title}/>
            <span>{curTask.title}</span>
          </div>
          <div className="calendar">
            <TargetGraph
              start={curTask.start}
              end={curTask.end}
            />
          </div>
          <div className="note"></div>
        </div>
      </div>
    )
  }

  onTaskItemClick = index => {
    this.setState({curIndex: index})
  }
}



