package com.dayssince

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.graphics.Color
import android.util.TypedValue
import android.widget.RemoteViews
import androidx.preference.PreferenceManager
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

class DaysWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val prefs = PreferenceManager.getDefaultSharedPreferences(context)
            val dateStr = prefs.getString("target_date", null) ?: LocalDate.now().toString()
            val mode = prefs.getString("mode", "countdown") ?: "countdown"
            val fontColor = prefs.getString("font_color", "#FFFFFF") ?: "#FFFFFF"
            val fontSize = prefs.getInt("font_size", 64)

            val views = RemoteViews(context.packageName, R.layout.widget_layout)
            
            try {
                val targetDate = LocalDate.parse(dateStr)
                val today = LocalDate.now()
                
                val diff = ChronoUnit.DAYS.between(today, targetDate)
                
                val displayValue = if (mode == "countup") {
                    Math.max(0, -diff)
                } else {
                    Math.max(0, diff)
                }

                views.setTextViewText(R.id.widget_digits, displayValue.toString())
                views.setTextViewText(R.id.widget_text_mode, if (mode == "countdown") "UNTIL" else "SINCE")
                
                val colorInt = Color.parseColor(fontColor)
                views.setTextColor(R.id.widget_digits, colorInt)
                views.setTextColor(R.id.widget_text_days, colorInt)
                views.setTextColor(R.id.widget_text_mode, colorInt)
                
                // Note: RemoteViews has limited support for exact text size setting dynamically
                // but we can set it in pixels
                views.setTextViewTextSize(R.id.widget_digits, TypedValue.COMPLEX_UNIT_SP, fontSize.toFloat())
                views.setTextViewTextSize(R.id.widget_text_days, TypedValue.COMPLEX_UNIT_SP, (fontSize * 0.3).toFloat())
                views.setTextViewTextSize(R.id.widget_text_mode, TypedValue.COMPLEX_UNIT_SP, (fontSize * 0.2).toFloat())
                
            } catch (e: Exception) {
                views.setTextViewText(R.id.widget_digits, "!")
            }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
