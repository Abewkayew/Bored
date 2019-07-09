
export const formatTime = (timeCreated) => {

    var periods = {
        month: 30 * 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000
      }
      var diff = Date.now() - timeCreated;

        if (diff > periods.minute) {
            return Math.floor(diff / periods.minute)
            // return Math.floor(diff / periods.minute) + "m";

        }
        return "Just now";

  }
