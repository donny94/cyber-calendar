import { TimeGridViewWrapper } from '../lib/wrappers/TimeGridViewWrapper'

fdescribe('timeGridEventMaxStack', () => {
  pushOptions({
    initialView: 'timeGridDay',
    initialDate: '2021-05-07',
    scrollTime: 0,
    timeGridEventMaxStack: 2,
  })

  it('puts hidden events in a popover', (done) => {
    let calendar = initCalendar({
      events: [
        { start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' },
        { start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' },
        { start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' }, // hidden
      ],
    })
    let timeGrid = new TimeGridViewWrapper(calendar).timeGrid
    let moreLinkEls = timeGrid.getMoreEls()
    expect(moreLinkEls.length).toBe(1)

    timeGrid.openMorePopover()
    setTimeout(() => {
      let moreEventEls = timeGrid.getMorePopoverEventEls()
      expect(moreEventEls.length).toBe(1)
      done()
    })
  })

  it('can drag events out of popover', (done) => {
    let calendar = initCalendar({
      editable: true,
      events: [
        { id: 'a', start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' },
        { id: 'b', start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' },
        { id: 'c', start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' }, // hidden
      ],
    })
    let timeGrid = new TimeGridViewWrapper(calendar).timeGrid
    timeGrid.openMorePopover()
    setTimeout(() => {
      let moreEventEls = timeGrid.getMorePopoverEventEls()
      let newStart = '2021-05-07T02:00:00'
      $(moreEventEls).simulate('drag', {
        end: timeGrid.getPoint(newStart),
        onRelease() {
          let event = calendar.getEventById('c')
          expect(event.start).toEqualDate(newStart)
          done()
        }
      })
    })
  })

  it('causes separate adjacent more links', () => {
    let calendar = initCalendar({
      events: [
        { start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' },
        { start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' },
        { start: '2021-05-07T00:00:00', end: '2021-05-07T01:00:00' }, // hidden
        { start: '2021-05-07T01:00:00', end: '2021-05-07T02:00:00' },
        { start: '2021-05-07T01:00:00', end: '2021-05-07T02:00:00' },
        { start: '2021-05-07T01:00:00', end: '2021-05-07T02:00:00' }, // hidden
      ],
    })
    let timeGrid = new TimeGridViewWrapper(calendar).timeGrid
    let moreLinkEls = timeGrid.getMoreEls()
    expect(moreLinkEls.length).toBe(2)
  })

  // TODO: test coords of more link
  it('puts overlapping hidden events in same popover', (done) => {
    let calendar = initCalendar({
      events: [
        { start: '2021-05-07T00:00:00', end: '2021-05-07T02:00:00' },
        { start: '2021-05-07T00:00:00', end: '2021-05-07T02:00:00' },
        { start: '2021-05-07T00:30:00', end: '2021-05-07T02:30:00' }, // hidden
        { start: '2021-05-07T01:00:00', end: '2021-05-07T03:00:00' }, // hidden
      ],
    })
    let timeGrid = new TimeGridViewWrapper(calendar).timeGrid
    let moreLinkEls = timeGrid.getMoreEls()
    expect(moreLinkEls.length).toBe(1)

    timeGrid.openMorePopover()
    setTimeout(() => {
      let moreEventEls = timeGrid.getMorePopoverEventEls()
      expect(moreEventEls.length).toBe(2)
      done()
    })
  })
})